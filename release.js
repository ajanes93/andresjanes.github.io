const fs = require('fs')
const inquirer = require('enquirer')
const semver = require('semver')
const pkg = require('./package.json')
const chalk = require('chalk')
const execa = require('execa')

const curVersion = pkg.version
const step = (msg) => console.log(chalk.cyan(msg))
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })

function updateVersion(version) {
    pkg.version = version
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n')
}

async function main() {
    const { stdout } = await run('git', ['branch', '--show-current'], {
        stdio: 'pipe'
    })

    if (stdout !== 'main') {
        throw new Error('Releases must be done from the main branch.')
    }

    const { newVersion } = await inquirer.prompt([
        {
            type: 'input',
            name: 'newVersion',
            message: `Please provide a version (current: ${curVersion}):`
        }
    ])

    if (!semver.valid(newVersion)) {
        throw new Error(`Invalid version: ${newVersion}`)
    }

    if (semver.lt(newVersion, curVersion)) {
        throw new Error(`New version (${newVersion}) cannot be lower than current version (${curVersion}).`)
    }

    const { yes } = await inquirer.prompt([
        {
            name: 'yes',
            message: `Release ${newVersion}?`,
            type: 'confirm'
        }
    ])

    if (yes) {
        // Run Tests
        step('\nRunning Tests...')
        await run('pnpm', ['run', 'test'])

        // Check Build
        step('\nChecking Build...')
        await run('pnpm', ['run', 'build'])

        // Update version
        step('\nUpdating version...')
        updateVersion(newVersion)

        // Generate changelog
        step('\nGenerating changelog...')
        await run(`pnpm`, ['run', 'changelog'])

        // Update lockfile
        step('\nUpdating lockfile...')
        await run(`pnpm`, ['install', '--prefer-offline'])

        // Commit changes
        const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
        if (stdout) {
            step('\nCommitting changes...')
            await run('git', ['add', '-A'])
            await run('git', ['commit', '-m', `release: v${newVersion}`])
        } else {
            console.log('No changes to commit.')
        }

        // push to GitHub
        step('\nPushing to Gitlab...')
        await run('git', ['tag', `v${newVersion}`])
        await run('git', ['push', 'origin', `refs/tags/v${newVersion}`])
        await run('git', ['push'])
    }
}

main().catch((err) => {
    updateVersion(curVersion)
    console.error(err)
})

import { render } from '@testing-library/vue'
import PortfolioItem from '../src/components/PortfolioItem.vue'
import { expect } from 'vitest'

const props = {
    href: 'https://www.google.com',
    text: 'Google',
    repo: 'https://wwww.github.com'
}

it('displays the title, links, and tooltips', () => {
    const { getByText, getByTestId } = render(PortfolioItem, { props })

    getByText(props.text)

    // Tooltips
    getByText('Repo')
    getByText('Open')

    const repoLink = getByTestId('repoLink')
    const siteLink = getByTestId('siteLink')

    expect(repoLink.getAttribute('href')).to.eq(props.repo)
    expect(siteLink.getAttribute('href')).to.eq(props.href)
})

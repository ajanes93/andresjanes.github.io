import { render } from '@testing-library/vue'
import BaseIcon from '../src/components/BaseIcon.vue'
import { mdiTestTube } from '@mdi/js/commonjs/mdi'
import { expect } from 'vitest'

const props = {
    color: 'black-600',
    path: mdiTestTube,
    size: 48,
    viewbox: '0 0 48 48'
}

test('it renders the icon svg with the correct styles', () => {
    const { getByTestId } = render(BaseIcon, {
        props
    })

    const svgIcon = getByTestId('svgIcon')
    const svgIconPath = getByTestId('svgIconPath')
    const dimensions: string[] = ['height', 'width']

    dimensions.forEach((type) => {
        expect(Number(svgIcon.getAttribute(type))).eq(props.size)
    })

    expect(svgIcon.getAttribute('viewBox')).to.eq(props.viewbox)
    expect(svgIcon.classList.contains(props.color)).to.be.true
    expect(svgIconPath.getAttribute('d')).to.eq(props.path)
})

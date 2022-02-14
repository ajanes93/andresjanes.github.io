import { render } from '@testing-library/vue'
import BaseTooltipButton from '../src/components/BaseTooltipButton.vue'
import { mdiTestTube } from '@mdi/js'

test('it renders slot data', () => {
    const slots = {
        default: 'Default Text'
    }

    const { getByText } = render(BaseTooltipButton, { slots })

    Object.values(slots).forEach((value) => {
        getByText(value)
    })
})

test('it shows tooltip when tooltip is set', () => {
    const tooltip = 'Tooltip Test'

    const { getByText } = render(BaseTooltipButton, {
        props: {
            tooltip
        }
    })

    getByText(tooltip)
})

test('it displays the icon when is set', () => {
    const { getByTestId } = render(BaseTooltipButton, {
        props: {
            iconPath: mdiTestTube
        }
    })

    getByTestId('svgIcon')
})

test('it sets links attributes correctly', () => {
    const props = {
        href: 'https://www.google.com',
        target: '_blank',
        download: 'google'
    }

    const { getByTestId } = render(BaseTooltipButton, { props })

    const el = getByTestId('buttonLink')

    expect(el.getAttribute('href')).to.eq(props.href)
    expect(el.getAttribute('target')).to.eq(props.target)
    expect(el.getAttribute('download')).to.eq(props.download)
})

import { render } from '@testing-library/vue'
import BaseIconLabel from '../src/components/BaseIconLabel.vue'
import { mdiTestTube } from '@mdi/js'
import { expect } from 'vitest'

const props = {
    iconPath: mdiTestTube,
    text: 'Text',
    tooltip: 'Tooltip'
}

test('it displays icon with label and tooltip', () => {
    const { getByText, getByTestId } = render(BaseIconLabel, { props })

    getByTestId('svgIcon')
    getByText(props.text)
    getByText(props.tooltip)
})

test('it removes tooltip when tooltip is not set', () => {
    const { queryByTestId } = render(BaseIconLabel, {
        props: {
            ...props,
            tooltip: undefined
        }
    })

    expect(queryByTestId('tooltip')).to.not.exist
})

import { render } from '@testing-library/vue'
import BaseSheet from '../src/components/BaseSheet.vue'

test('it renders slot data', () => {
    const slots = {
        sidebar: 'Sidebar Text',
        default: 'Default Text'
    }

    const { getByText } = render(BaseSheet, { slots })

    Object.values(slots).forEach((value) => {
        getByText(value)
    })
})

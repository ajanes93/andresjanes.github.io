import { render } from '@testing-library/vue'
import BaseChip from '../src/components/BaseChip.vue'

test('it renders slot data', () => {
    const slots = {
        default: 'Chip Text'
    }

    const { getByText } = render(BaseChip, { slots })

    getByText(slots.default)
})

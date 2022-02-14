import { render } from '@testing-library/vue'
import ExperienceSection from '../src/components/ExperienceSection.vue'
import { format } from 'date-fns'

const props = {
    title: 'Tester',
    company: 'Test Company',
    description: 'Test Description',
    location: 'Test Town',
    logoPath: '/img/wt.svg',
    startDate: new Date('2022-01-01').toISOString()
}

const formatDate = (value: string): string => format(new Date(value), 'MMM yy')
const startDate = formatDate(props.startDate)

it('shows the logo', () => {
    const { getByAltText } = render(ExperienceSection, { props })

    getByAltText('experience logo')
})

it('shows the experience details', () => {
    const { getByText } = render(ExperienceSection, { props })

    getByText(props.title)
    getByText(props.company)
    getByText(props.description)
    getByText(props.location)
})

it('sets the end date to `present` if no end date is set', () => {
    const { getByText } = render(ExperienceSection, { props })

    getByText(`${startDate} - present`)
})

it('sets the end date to `MM yy` if end date is set', () => {
    const endDate = new Date().toISOString()
    const { getByText } = render(ExperienceSection, {
        props: {
            ...props,
            endDate
        }
    })

    getByText(`${startDate} - ${formatDate(endDate)}`)
})

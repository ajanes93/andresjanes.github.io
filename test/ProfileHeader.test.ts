import { render } from '@testing-library/vue'
import ProfileHeader from '../src/components/ProfileHeader.vue'

const props = {
    imgSrc: '/img/profile.webp',
    name: 'Andres Janes',
    position: 'Frontend Developer'
}

it('displays the profileImage', () => {
    const { getByAltText } = render(ProfileHeader, { props })

    getByAltText('Profile Picture')
})

it('displays the name and position', () => {
    const { getByText } = render(ProfileHeader, { props })

    getByText(props.name)
    getByText(props.position)
})

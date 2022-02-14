export type TextValueItem = {
    text: string
    value: string
}

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top'

export type Link = {
    text: string
    href: string
    icon: string
    target?: LinkTarget
    download?: boolean | string
}

export type PortfolioLink = {
    text: string
    href: string
    repo: string
}

export type DetailsItem = {
    title: string
    items: TextValueItem[]
}

export type ExperienceItem = {
    title: string
    company: string
    location: string
    startDate: string
    endDate?: string
    description: string
    logoPath: string
}

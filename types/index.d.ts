declare type LinkTarget = '_blank' | '_self' | '_parent' | '_top' | 'framename'

declare type HasPropType<T> = {
    [Property in keyof T]?: boolean
}

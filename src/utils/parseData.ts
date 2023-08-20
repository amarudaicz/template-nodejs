export const parseJson = (data:string) => {
    if (!data) return null
    return JSON.parse(data)
}
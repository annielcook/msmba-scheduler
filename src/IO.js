
export async function loadFile(filePath) {
    const response = await fetch(filePath);
    return response.text();
}


export async function getJson(url) {
    try {
        let response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}
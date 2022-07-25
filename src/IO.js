
export async function loadFile(filePath) {
    const response = await fetch(filePath);
    return response.text();
}
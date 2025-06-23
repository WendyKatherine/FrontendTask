import { Global } from './Global';

export const uploadFiles = async (url, files, name) => {
    const formData = new FormData();

    // Agregar los archivos al FormData
    for (let i = 0; i < files.length; i++) {
        formData.append(name, files[i], files[i].name);
    }

    try {
        // Realizar la petición con fetch
        const response = await fetch(`${Global.url}${url}`, {
            method: 'POST',
            body: formData,
        });

        // Verificar la respuesta
        if (response.ok) {
            const data = await response.json();
            return data; // Resuelve con la data si la petición fue exitosa
        } else {
            const errorText = await response.text();
            throw new Error(errorText); // Rechaza con el error de respuesta
        }
    } catch (error) {
        console.error("Error subiendo archivos:", error);
        throw error; // Rechaza con el error si algo falla en la petición
    }
};

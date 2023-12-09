import { readFile } from "node:fs/promises"
import path from "node:path";

export const fetchData = async (filename) => {
    const p = path.join(process.cwd(), filename);
    try {
        const data = await readFile(p, {
            encoding: 'utf-8'
        });
        return data;
    } catch (error) {
        console.log("[ERROR]: Could not read file located at:", p);
        return null;
    }
}
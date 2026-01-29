import type { Handler } from "@/types/Handler";
import express from "express";

const map = new Map<string, Handler>();

const helloHandler: Handler = async (req, res) => {
    res.send("Hello World!").end();
};

map.set("hello", helloHandler);

const app = express();

app.get("/:fx", async (req: Request, res: Response) => {
    const { fx } = req.params;
    if (!fx || fx === "" || !map.has(fx)) {
        res.status(404).json({
            error: "Not Found",
        });
    }


    map.get(fx)(req, res);
});

app.listen(3000, () => {
    console.log("Fx Initalized.");
});

// soubor: functions/src/index.ts

import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import ImageKit from "imagekit";
import cors from "cors";
import * as crypto from "crypto";

const corsHandler = cors({ origin: true } );

const IMAGEKIT_PRIVATE_KEY = defineSecret("IMAGEKIT_PRIVATE_KEY");
const IMAGEKIT_URL_ENDPOINT = defineSecret("IMAGEKIT_URL_ENDPOINT");

export const imagekitAuth = onRequest((req, res) => {
    corsHandler(req, res, async () => {
        try {
            console.log("Generating ImageKit auth parameters...");

            const imagekit = new ImageKit({
                publicKey: "public_/gSYQ87aEJTjS0H+HWZhXeyVLyE=",
                privateKey: IMAGEKIT_PRIVATE_KEY.value(),
                urlEndpoint: IMAGEKIT_URL_ENDPOINT.value(),
            });

            const token = crypto.randomUUID();

            const params = imagekit.getAuthenticationParameters(token);

            console.log("Auth params generated:", params);

            res.status(200).json(params);
        } catch (error) {
            console.error("🔥 ImageKit auth error:", error);
            res.status(500).json({ error: "Auth failed", details: (error as any).message });
        }
    });
});


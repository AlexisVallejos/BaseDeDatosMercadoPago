import express from "express";
import cors from "cors";
// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-8313888174196549-070414-cfd7e303bca51d20846f8c5d856e1f60-349531447",
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Soy el server :)");
});

app.post("/create_preference", async (req, res) => {
    try {
      const body = {
        items: [
          {
            title: req.body.title,
            quantity: Number(req.body.quantity),
            unit_price: Number(req.body.price),
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: "https://img.freepik.com/vector-premium/icono-color-hecho-ok-completado-listo_890735-37.jpg",
          failure: "https://www.youtube.com/@onthecode",
          pending: "https://media.tenor.com/ZJ20Sx_hfPsAAAAi/pendiente-altecnia.gif",
        },
        auto_return: "approved",
      };

      const preference = new Preference(client);
      const result = await preference.create({body});
  
      res.json({
        id: result.id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Error al crear la preferencia :(',
      });
    }
});

app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
import express from 'express';
import path from 'path';
import gameRoutes from './routes/game.js';

const __dirname = path.resolve();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Server is listening at http://localhost:${port}/ Let's play the game :)`);
});

//wskazujemy miejsce, z którego chcemy dostarczać statyczne pliki (index.html itp.)
app.use(express.static(path.join(__dirname + '/public')));

gameRoutes(app);

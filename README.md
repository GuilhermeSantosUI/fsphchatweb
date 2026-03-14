<script src="http://localhost:5173/dist/agnotifica-widget.min.js" data-root="http://localhost:5174/" data-use-app="true" data-value="Hello from teste"></script>

mkdir -p dist
npx esbuild embed/agnotifica-widget.js --bundle --minify --sourcemap --outfile=dist/agnotifica-widget.min.js --platform=browser --format=iife --global-name=Agnotifica
cp public/widget.html dist/widget.html
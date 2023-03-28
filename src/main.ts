(function () {
    textWithCanvasCover({
        selector: ".text-with-cover"
    });
}())

interface ITextWithCanvasCover {
    selector: string,
    // Interval in milliseconds to clear the cover. Every time the cover will be cleared on the "sizeClearedArea" value. Default is 10ms.
    intervalSpeedMs?: number,
    // Size of the cleared area every iteration in pixels. Default is {width: 20, height: 20}
    sizeClearedArea?: { width: number, height: number },
    /*
    * contain of the canvas. It can be either rectangles or circles.<br>
    * Default is {shape: "rectangles", sizeShapes: {width: 10, height: 10}}.<br>
    * !!! You will see the result only if you will use the property "randomContainCanvas"
    * */
    containCanvas?:
        {
            shape: "rectangles",
            sizeShapes: { width: number, height: number }
        }
        |
        {
            shape: "circles",
            sizeShapes: { radius: number }
        }
    /*
    * It uses to create automatically the shapes (rectangles ot circles) in the canvas.<br>
    * Target content will be cleared as well as without this property, but is you set this one to true -<br>
    * your content paddings and margins will be partially filled with the canvas shapes even after clear.
    *
    * !!! So, your content should have the free space in the container.
    * */
    randomContainCanvas?: boolean
}

function textWithCanvasCover({
                                 selector,
                                 intervalSpeedMs = 10,
                                 sizeClearedArea = {width: 20, height: 20},
                             }: ITextWithCanvasCover) {
    const textWithCanvas = document.querySelector(selector);
    if (!textWithCanvas) throw new Error("Container element not found");

    const text: HTMLSpanElement | null = textWithCanvas.querySelector("span");
    const canvas: HTMLCanvasElement | null = textWithCanvas.querySelector('canvas');
    if (!canvas || !text) throw new Error("Canvas or text not found");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Context is null");
    const textRect = text.getBoundingClientRect();


    // logic
    canvas.width = textRect.width;
    canvas.height = textRect.height;

    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // test change area to the transparent fill
    context.globalCompositeOperation = 'destination-out';

    canvas.addEventListener("mousemove", (event) => {
        context.fillRect(event.clientX, event.clientY, sizeClearedArea.width, sizeClearedArea.height);
    })
    const pixelToClear = {
        x: 0,
        y: 0
    }

    const interval = setInterval(() => {
        if (pixelToClear.x >= canvas.width && pixelToClear.y >= canvas.height) {
            clearInterval(interval);
            return;
        }

        if (pixelToClear.x >= canvas.width) {
            pixelToClear.x = 0;
            pixelToClear.y += sizeClearedArea.height;
        }

        canvas.dispatchEvent(createMouseMoveEvent(pixelToClear.x, pixelToClear.y));
        pixelToClear.x += sizeClearedArea.width;
    }, intervalSpeedMs)
}

function createMouseMoveEvent(clientX: number, clientY: number) {
    return new MouseEvent("mousemove", {clientX, clientY})
}

export {}
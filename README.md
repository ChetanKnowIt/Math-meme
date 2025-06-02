# Math Meme Generator

## Description

The Math Meme Generator is a web-based application that allows users to upload images and generate mathematical functions that approximate observed shapes within those images. The generated functions are displayed in a Heads-Up Display (HUD) style over the image.

This project aims to explore the intersection of computer vision (shape recognition and fitting) and mathematical representation in a fun, interactive way.

## Current Features

*   **Image Loading:** Upload JPG, PNG, GIF, or other browser-supported image formats. The image is displayed on a canvas.
*   **Rectangle Tool:**
    *   Activate by clicking the "Select Rectangle" button.
    *   Click and drag on the image to draw a rectangle.
    *   The mathematical definition of the rectangle (e.g., `x_min <= x <= x_max`, `y_min <= y <= y_max`) is displayed on the HUD.
*   **Ellipse / General Conic Tool:**
    *   Activate by clicking the "Select Ellipse" button.
    *   Click 5 or more points on the image to define the approximate shape of an ellipse.
    *   Click the "Select Ellipse" button again to attempt to fit a general conic section (`Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0`) to these points.
    *   The equation of the fitted conic is displayed on the HUD.
    *   The application attempts to draw the fitted conic on the canvas.
*   **HUD Display:**
    *   Mathematical equations are shown using the "Roboto Mono" font.
    *   The display is styled like a futuristic HUD, overlaying the canvas with green text on a semi-transparent background.
*   **Basic Error Handling:** Provides feedback for invalid file types, image loading errors, and issues during ellipse fitting.

## Basic Usage

1.  **Upload an Image:**
    *   Click the "Choose File" button (or similarly labeled input) to select an image from your computer.
    *   The image will appear on the canvas.

2.  **Using the Rectangle Tool:**
    *   Click the "Select Rectangle" button. The button will indicate it's active.
    *   Move your mouse to the canvas, then click and hold the left mouse button at the starting corner of your desired rectangle.
    *   Drag the mouse to the opposite corner of the rectangle. A preview of the rectangle will be drawn.
    *   Release the mouse button. The final rectangle will be drawn, and its mathematical definition will appear on the HUD.

3.  **Using the Ellipse Tool:**
    *   Click the "Select Ellipse" button. The button and messages will indicate it's active.
    *   Click at least 5 distinct points on the image canvas where you want the ellipse to pass through or near. Each click adds a point, and lines will connect them as a visual guide.
    *   Once you have placed at least 5 points, click the "Select Ellipse" button again.
    *   The application will attempt to fit a conic section to your points. Its equation will appear on the HUD, and the shape will be drawn on the canvas.
    *   If the fitting is unsuccessful, an error message will be displayed. You can try adding more points or adjusting existing ones (note: point adjustment isn't a feature yet, so you'd clear and restart point selection or add more).

## Future Considerations (Not Yet Implemented)

*   More robust ellipse fitting algorithms (specifically ensuring an ellipse is fitted).
*   Conversion of general conic parameters to geometric ellipse parameters (center, axes, rotation).
*   More accurate drawing of fitted ellipses (e.g., using parametric equations).
*   User editing of selected points or shapes.
*   Support for more shapes and more complex function generation.
*   Saving or exporting the "math meme" (image with overlaid function).

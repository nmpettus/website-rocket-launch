
/**
 * Opens a new window and prints the image at the given path
 */
export const printImage = (imagePath: string): void => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Activity</title>
          <style>
            body { 
              margin: 0; 
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            img { 
              max-width: 100%; 
              max-height: 100vh;
              object-fit: contain;
            }
            @media print {
              body { height: auto; }
            }
          </style>
        </head>
        <body>
          <img src="${window.location.origin}${imagePath}" alt="Activity to print" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

var pieceImages = {
    'r': '/chess_piece_images/black_rook.png',
    'n': '/chess_piece_images/black_knight.png',
    'b': '/chess_piece_images/black_bishop.png',
    'q': '/chess_piece_images/black_queen.png',
    'k': '/chess_piece_images/black_king.png',
    'p': '/chess_piece_images/black_pawn.png',
    'R': '/chess_piece_images/white_rook.png',
    'N': '/chess_piece_images/white_knight.png',
    'B': '/chess_piece_images/white_bishop.png',
    'Q': '/chess_piece_images/white_queen.png',
    'K': '/chess_piece_images/white_king.png',
    'P': '/chess_piece_images/white_pawn.png'
};

function loadImage(src) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function() {
            resolve(img);
        };
        img.onerror = function() {
            reject(new Error('Failed to load image: ' + src));
        };
        img.src = src;
    });
}

async function generateChessboard(fen, width, height) {
    var canvas = document.getElementById('chessboard');
    var ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    var squareWidth = width / 8;
    var squareHeight = height / 8;
    var borderWidth = squareHeight / 24;

    var ranks = fen.split('/');

    for (var rank = 0; rank < ranks.length; rank++) {
        var currentRank = ranks[rank];
        var fileIndex = 0;

        for (var file = 0; file < currentRank.length; file++) {
            var currentSquare = currentRank[file];

            if (!isNaN(currentSquare)) {
                var emptySquares = parseInt(currentSquare);
                for (var i = 0; i < emptySquares; i++) {
                    var x = fileIndex * squareWidth;
                    var y = rank * squareHeight;

                    // Draw the background color
                    ctx.fillStyle = (fileIndex + rank) % 2 === 0 ? '#f0d9b5' : '#b58863';
                    ctx.fillRect(x, y, squareWidth, squareHeight);

                    // Draw the border
                    ctx.lineWidth = borderWidth;
                    ctx.strokeStyle = '#000000';
                    ctx.strokeRect(x + borderWidth / 2, y + borderWidth / 2, squareWidth - borderWidth, squareHeight - borderWidth);

                    fileIndex++;
                }
            } else {
                var pieceImgSrc = pieceImages[currentSquare];
                var x = fileIndex * squareWidth;
                var y = rank * squareHeight;

                try {
                    var pieceImg = await loadImage(pieceImgSrc);

                    // Draw the background color
                    ctx.fillStyle = (fileIndex + rank) % 2 === 0 ? '#f0d9b5' : '#b58863';
                    ctx.fillRect(x, y, squareWidth, squareHeight);

                    // Draw the border
                    ctx.lineWidth = borderWidth;
                    ctx.strokeStyle = '#000000';
                    ctx.strokeRect(x + borderWidth / 2, y + borderWidth / 2, squareWidth - borderWidth, squareHeight - borderWidth);

                    // Draw the piece image
                    ctx.drawImage(pieceImg, x, y, squareWidth, squareHeight);

                    fileIndex++;
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
}

var fenString = "r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1";
generateChessboard(fenString, 800, 800);

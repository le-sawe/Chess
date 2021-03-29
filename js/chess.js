    /*
    So how this work ??
    1. select a piece
    2. get the domain of mouvement to this piece
    3. refresh the board (display the domain of mouvement on the board (cercle when you can move , red cadre when you can eat , blue cadre en passant mouve, castle)
    4. select a square
    5. check the status of this square (by using the mouvement doamin array) 
    6. respond to the selected square (move to this square , eat on this square)
    7. refresh the board
    */
    // get some element by id
    var dialog = document.getElementById('dialog');//get dialog element 
    var the_board = document.getElementById('board');//get board div
    var mouvement_record = document.getElementById('mouvement_record');//get mouvement record div
    var player_indicator = document.getElementById('player_indicator');//get player indicator div
    var out_pieces_white = document.getElementById('out_pieces_white');//get out pieces indicator div
    var out_pieces_black = document.getElementById('out_pieces_black');//get out pieces indicator div
    // player
    var player = 0;//0 white , 1 black
    // horizontal_axe
    var horizontal_axe = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] //used to conver from number to letter in x axis
    // pieces used to convert from the piece number to the name of the piece
    var piece = [
        'White King',//-- 0
        'White Queen',//-- 1
        'White Rook',//-- 2
        'White Bishop',//-- 3
        'White Knight',//-- 4
        'White Pawn',//-- 5
        'vide',//-- 6
        'Black Knig',//-- 7
        'Black Queen',//-- 8
        'Black Rook',//-- 9
        'Black Bishop',//-- 10
        'Black Knight',//-- 11
        'Black Pawn',//-- 12
    ]
    // mouvement list used to record mouvement
    var mouvement = [];
    // from_to used for instant move
    var from_to = [[], []]//from_to[0] : from ,from_to[1] : to 
    // the list of pieces eated
    var out_pieces = new Array;
    // board [y][x]
    var board = [
        [2, 4, 3, 1, 0, 3, 4, 2],
        [5, 5, 5, 5, 5, 5, 5, 5],
        [6, 6, 6, 6, 6, 6, 6, 6],
        [6, 6, 6, 6, 6, 6, 6, 6],
        [6, 6, 6, 6, 6, 6, 6, 6],
        [6, 6, 6, 6, 6, 6, 6, 6],
        [12, 12, 12, 12, 12, 12, 12, 12],
        [9, 11, 10, 8, 7, 10, 11, 9],
    ];
    /*mouvement_domain[y][x]
    0 mean you can't reach
    1 mean you can move there
    2 mean you can eat there
    3 mean you can't jump over this piece
    4 mean you cant't eat your pieces
    5 used for en passant case
    6 used for casteling
    */
   var board_with_time=new Array;
   board_with_time[0]=board;
   board_with_time_lenght=0;
    var mouvement_domain = [
        [0, 0, 0, 0, 0, 0, 0, 0],//0
        [0, 0, 0, 0, 0, 0, 0, 0],//1
        [0, 0, 0, 0, 0, 0, 0, 0],//2
        [0, 0, 0, 0, 0, 0, 0, 0],//3
        [0, 0, 0, 0, 0, 0, 0, 0],//4
        [0, 0, 0, 0, 0, 0, 0, 0],//5
        [0, 0, 0, 0, 0, 0, 0, 0],//6
        [0, 0, 0, 0, 0, 0, 0, 0],//7
        //a, b, c, d, e, f, g, h
    ];
    var reach_a_block = 0; // this variable used on square check function
    // Refresh  board function
    function refresh_board(status, y, x) {
        // out pieces print
        out_pieces_white.innerHTML="";
        out_pieces_black.innerHTML="";
        for (i in out_pieces){
            if(out_pieces[i]<6){
                out_pieces_white.innerHTML+=" <img src='icon/" + piece[out_pieces[i]] + ".png' class='out_pieces_piece' >";
            }
            if(out_pieces[i]>6){
                out_pieces_black.innerHTML+=" <img src='icon/" + piece[out_pieces[i]] + ".png' class='out_pieces_piece' >";
            }

        }

        // Check if the kings can still castle   
        check_castling_right();

        // Print white move or black move (player turn)
        if (player == 0) player_indicator.innerHTML = "<div class='player_indicator_white'>White move</div>";
        else { player_indicator.innerHTML = "<div class='player_indicator_black'>Black move</div>"; }

        // Print the mouvement list
        mouvement_record.innerHTML = "";// ereas all printed thing befor
        for (var i in mouvement) {
            if (i % 2 == 0) { mouvement_record.innerHTML += "<div class='white_move_record' >" + mouvement[i] + "</div>"; }//white move 
            else { mouvement_record.innerHTML += "<div class='black_move_record' >" + mouvement[i] + "</div>"; };// black move      
        }

        //Print the board
        the_board.innerHTML = '';// ereas the printed board before
        // the status of unselected piece
        if (status == 0) {
            var z;// used to print y indicator
            for (var j = 7; j > -1; j--) {
                z = j + 1;
                the_board.innerHTML += "<span style='background:rgba(94, 91, 91, 0.795);text-align: center;padding:auto auto;height:12.4%;color:white;width:1.6%;'>" + z + "</span>"; // Print y indicator
                for (var i = 0; i < 8; i++) {// print line of cells
                    if ((i % 2 == 0 && j % 2 == 0) || i % 2 != 0 && j % 2 != 0) { background = '#f1d9b5'; } else { background = '#b58863'; } // used to print white black cells
                    the_board.innerHTML += "<button class='square' style='background-color:" + background + "' onclick='from(" + j + "," + i + ");'>  <img src='icon/" + piece[board[j][i]] + ".png' style='margin:auto;height: 80%;' ></button>";//print cell
                }
            }
            the_board.innerHTML += "<span style='background:rgba(94, 91, 91, 0.795);text-align: center;padding:auto auto;width:0.5%;color:white;'></span>";
            for (var i = 0; i < 8; i++) {//print the x indicator
                the_board.innerHTML += "<span style='background:rgba(94, 91, 91, 0.795);text-align: center;padding:auto auto;width:12.4%;color:white;'>" + horizontal_axe[i] + "</span>";
            }
        }
        //the status of selected piece
        else if (status == 1) {
            for (var j = 7; j > -1; j--) {
                z = j + 1;
                the_board.innerHTML += "<span style='background:rgba(94, 91, 91, 0.795);text-align: center;padding:auto auto;height:12.4%;color:white;width:1.6%;'>" + z + "</span>";// Print y indicator
                for (var i = 0; i < 8; i++) {// print line of cells
                    if (i == x && j == y) { the_board.innerHTML += "<button class='square' style='background-color:green;'  onclick='refresh_board(0,0,0);'>  <img src='icon/" + piece[board[j][i]] + ".png' style='margin:auto;height: 80%;' ></button>"; }
                    else {
                        if ((i % 2 == 0 && j % 2 == 0) || i % 2 != 0 && j % 2 != 0) { background = '#f1d9b5'; } else { background = '#b58863'; }// used to print white black cells
                        if (mouvement_domain[j][i] == 1) {// if the selected piece can move to this square put a cercle on it
                            the_board.innerHTML += "<button class='square' style='background-color:" + background + ";'   onclick='to(" + j + "," + i + "," + player + ");'> <img src='icon/youc_can_move.png' style='margin:auto;height: 60%;' ></button>";
                        } else if (mouvement_domain[j][i] == 2) {// if the selected piece can eat on this square border this square with red
                            the_board.innerHTML += "<button class='square' style='background-color:" + background + ";border:solid 2px red;'   onclick='to(" + j + "," + i + "," + player + ");'> <img src='icon/" + piece[board[j][i]] + ".png' style='margin:auto;height: 60%;' ></button>";
                        } else if (mouvement_domain[j][i] == 5) {// if the pawn can make the en passant move border this square with blue
                            the_board.innerHTML += "<button class='square' style='background-color:" + background + ";border:solid 2px blue;'   onclick='to(" + j + "," + i + "," + player + ");'> <img src='icon/" + piece[board[j][i]] + ".png' style='margin:auto;height: 60%;' ></button>";
                        } else {// the rest of the board
                            the_board.innerHTML += "<button class='square' style='background-color:" + background + ";'   onclick='to(" + j + "," + i + "," + player + ");'> <img src='icon/" + piece[board[j][i]] + ".png' style='margin:auto;height: 80%;' ></button>";
                        }
                    }
                }
            }
            the_board.innerHTML += "<span style='background:rgba(94, 91, 91, 0.795);text-align: center;padding:auto auto;width:0.5%;color:white;'></span>";
            for (var i = 0; i < 8; i++) {//print x indicator
                the_board.innerHTML += "<span style='background:rgba(94, 91, 91, 0.795);text-align: center;padding:auto auto;width:12.4%;color:white;'>" + horizontal_axe[i] + "</span>";
            }
        }
        // the status when the pawn is promoted
        else if (status == -1) {
            var z;
            for (var j = 7; j > -1; j--) {
                z = j + 1;
                the_board.innerHTML += "<span style='background:rgba(94, 91, 91, 0.795);text-align: center;padding:auto auto;height:12.4%;color:white;width:1.6%;'>" + z + "</span>";// Print y indicator
                for (var i = 0; i < 8; i++) {// make all the background of cells transparent when choosing the promotion
                    the_board.innerHTML += "<button class='square' style='background-color:gray ;'>  <img src='icon/" + piece[board[j][i]] + ".png' style='margin:auto;height: 80%;' ></button>";
                }
            }
            the_board.innerHTML += "<span style='background:rgba(94, 91, 91, 0.795);text-align: center;padding:auto auto;width:0.5%;color:white;'></span>";
            for (var i = 0; i < 8; i++) {// Print x indicator
                the_board.innerHTML += "<span style='background:rgba(94, 91, 91, 0.795);text-align: center;padding:auto auto;width:12.4%;color:white;'>" + horizontal_axe[i] + "</span>";
            }
        }
    }

    // Switch player function
    function switch_player() {if (player == 1) player = 0;else  player = 1;}
    
    // MOUVEMENT FUNCTIONS START

    //Straight move function
    function straight_move(y, x, player) {
        var t ,z;
        //move right and check if ther a block
        reach_a_block = 0;
        for (var i = x + 1; i < 8; i++) {check_the_squear(y,i);}
        //move left and check if ther a block
        reach_a_block = 0;
        for (var i = x - 1; i > -1; i--) {check_the_squear(y,i);}
        //move top and check if ther a block
        reach_a_block = 0;
        for (var i = y + 1; i < 8; i++) {check_the_squear(i,x);}
        //move bottom and check if ther a block
        reach_a_block = 0;
        for (var i = y - 1; i > -1; i--) {check_the_squear(i,x);}
    }
    //Diagonal move function
    function diagonal_move(y, x, player) {
        //move top right and check if ther a block
        reach_a_block = 0;
        for (var i = x + 1, j = y + 1; i < 8 && j < 8; i++, j++) {check_the_squear(j,i);}
        //move top left and check if ther a block
        reach_a_block = 0;
        for (var i = x - 1, j = y + 1; i > -1 && j < 8; i--, j++) {check_the_squear(j,i);}
        //move bottom right and check if ther a block
        reach_a_block = 0;
        for (var i = x + 1, j = y - 1; i < 8 && j > -1; i++, j--) {check_the_squear(j,i);}
        //move bottom left and check if ther a block
        reach_a_block = 0;
        for (var i = x - 1, j = y - 1; i > -1 && j > -1; i--, j--) {check_the_squear(j,i);}

    }
    
    // MOUVEMENT FUNCTIONS END
    
    //  check the status of the square and  return the status of the square
    function check_the_squear_root(z, player) {
        var t;
        /* check if vide square */if (z == 6) t = 1;/* check if enemy piece */else if ((z > 6 && player == 0) || (z < 6 && player == 1)) t = 2;/* check if own piece */else if ((z < 6 && player == 0) || (z > 6 && player == 1)) t = 4;
        return t;
    }

    // check the status of the square and edit the movement domain 
    function check_the_squear(j,i){
        if (reach_a_block == 1) {
                mouvement_domain[j][i] = 3;
            }
            else {
                z= board[j][i];
                t =check_the_squear_root(z,player);
                // check for enemy piece
                if (t==2) {
                    mouvement_domain[j][i] = 2;
                    reach_a_block = 1;
                }
                // check for vide square
                else if (t==1) {
                    mouvement_domain[j][i] = 1;
                }
                // check for own piece
                else if (t==4) {
                    mouvement_domain[j][i] = 4;
                    reach_a_block = 1;
                }
                // else than top u can t reach
                else {
                    mouvement_domain[j][i] = 0;
                }
                }
    }
    // from function
    function from(y, x) {
        selected_piece = board[y][x];//The selected piece symbole
        if ((selected_piece < 6 && player == 1) || (selected_piece > 6 && player == 0)) {// if the selected piece is an enemy piece
            alert("Play with your pieces");
        }
        else if (selected_piece == 6) {// if the selected square is vide
            alert("Pick a piece");

        }
        else {
            from_to[0] = [y, x] // save in instant the from value
            get_mouvement_domain(y, x); // get the mouvement domain of the selected piece
            refresh_board(1, y, x); // prepear the board to the to function
        }


    }
    // to function
    function to(y, x, player) {
        selected_square = board[y][x];// get the selected square
        selected_piece1 = board[from_to[0][0]][from_to[0][1]];// get the selecetd piece (piece with 1 bcs the selected_piece is a variable and parametre for a function)
        switch (mouvement_domain[y][x]) {// the status of the selected square 0 --> you can t reach / 1 --> move / 2--> eat / 3--> you cant jump / 4--> dont eat your piece / 5 --> en passant move / 6--> castle
            // YOU CANT REACH CASE
            case 0:
                alert("You can't reach this square with this piece");
                break;
            // MOVE CASE
            case 1:
                // set an instant value 
                from_to[1] = [y, x]
                // make the square of the selected piece vide 
                board[from_to[0][0]][from_to[0][1]] = 6; 
                // set the selected piece on the selected square
                board[y][x] = selected_piece1;
                // save the current board in list
                save_board_to_history();
                // save the move to the movement list
                var q = from_to[0][0] + 1,w = y + 1;mouvement.push(piece[selected_piece1] + " from " + horizontal_axe[from_to[0][1]] + q + " to " + horizontal_axe[x] + w);
                // check if the king in danger after this move (if true we will restore the last board before the move and delete the move from mouvement list)
                if (The_king_in_danger()){wrong_move(); alert('you can t move there your king will be in direct threat');switch_player();}
                //switch player 
                switch_player();
                // update the board
                refresh_board(0, 0, 0);
                // check for pawn promotion (check if there a pawn promotion case)
                pawn_promotion(y, x, 0);
                break;
            // EAT CASE
            case 2:
                // set an instant value 
                from_to[1] = [y, x];
                // make the square of the selected piece vide 
                board[from_to[0][0]][from_to[0][1]] = 6;
                // store the eated piece in variable
                eated_piece = board[y][x];
                // replace the selected square by the selected piece (eat)
                board[y][x] = selected_piece1;
                // save the current board in list
                save_board_to_history();
                // save the move to the movement list
                var q = from_to[0][0] + 1,w = y + 1;mouvement.push(piece[selected_piece1] + " from " + horizontal_axe[from_to[0][1]] + q + " to " + horizontal_axe[x] + w);
                // save the eated piece to the out_piece list
                out_pieces.push(eated_piece);
                // check if the king in danger after this move (if true we will restore the last board before the move and delete the move from mouvement list and delete the eated piece from the out piece)
                if (The_king_in_danger()){wrong_move(); alert('you can t move there your king will be in direct threat');switch_player();out_pieces.pop();}
                //switch player
                switch_player();
                // update the board
                refresh_board(0, 0, 0);
                // check for pawn promotion (check if there a pawn promotion case)
                pawn_promotion(y, x, 0);
                break;
            // JUMP OVER PIECES CASE
            case 3:
                alert("you can't jump over pieces with this piece");
                break;
            // EAT YOUR PIECE CASE
            case 4:
                alert('Dont eat your pieces !!');
                break;
            //EN PASSANT MOVE
            case 5:
                // en passant move
                from_to[1] = [y, x]
                board[from_to[0][0]][from_to[0][1]] = 6;
                if (player == 0) {eated_piece =12; board[y + 1][x] = 6;board[y - 1][x] =6;}// selecte the eated piece black pawn 12 ; make the from square vide ; replace the black pawn (eated ) by vide
                else if (player == 1) {eated_piece = 5; board[y - 1][x] = 6;board[y + 1][x] =6;}// selecte the eated piece white pawn 5 ; make the from square vide ; replace the white pawn (eated ) by vide                
                board[y][x] = selected_piece1;// the to square white pawn or black pawn
                out_pieces.push(eated_piece);// add the eated piece to the list
                save_board_to_history();
                var q = from_to[0][0] + 1;
                var w = y + 1;
                mouvement.push(piece[selected_piece1] + " from " + horizontal_axe[from_to[0][1]] + q + " eat in " + horizontal_axe[x] + w);// add the move to the movement list
                if (The_king_in_danger()){wrong_move(); alert('you can t move there your king will be in direct threat');switch_player();out_pieces.pop();} // check if wrong move
                switch_player();
                refresh_board(0, 0, 0);
                break;
            // CASTLING CASE
            case 6:
                //castle
                switch (true) {
                    case y == 7 && x == 7:
                        board[7][7] = 6;
                        board[7][6] = 7;
                        board[7][5] = 9;
                        board[7][4] = 6;
                        from_to[1] = [y, x];
                        save_board_to_history();
                        mouvement.push("Black king castle in king side");
                        if (The_king_in_danger()) {wrong_move();alert('you can t castle, your king will be in direct threat')}
                        switch_player();
                        refresh_board(0, 0, 0);
                        break;
                    case y == 7 && x == 0:
                        board[7][0] = 6;
                        board[7][1] = 6;
                        board[7][2] = 7;
                        board[7][3] = 9;
                        from_to[1] = [y, x];
                        save_board_to_history();
                        mouvement.push("Black king castle in queen side");
                        if (The_king_in_danger()) {wrong_move();alert('you can t castle, your king will be in direct threat')}
                        switch_player();
                        refresh_board(0, 0, 0);
                        break;
                    case y == 0 && x == 0:
                        board[0][0] = 6;
                        board[0][1] = 6;
                        board[0][2] = 0;
                        board[0][3] = 2;
                        from_to[1] = [y, x];
                        save_board_to_history();
                        mouvement.push("White king castle in queen side");
                        if (The_king_in_danger()) {wrong_move();alert('you can t castle, your king will be in direct threat');}
                        switch_player();
                        refresh_board(0, 0, 0);
                        break;
                    case y == 0 && x == 7:
                        board[0][7] = 6;
                        board[0][6] = 0;
                        board[0][5] = 2;
                        board[0][4] = 6;
                        from_to[1] = [y, x];
                        save_board_to_history();
                        mouvement.push("White king castle in king side");
                        if (The_king_in_danger()) {wrong_move();alert('you can t castle, your king will be in direct threat')}
                        switch_player();
                        refresh_board(0, 0, 0);
                        break;
                }
        }

    }
    // check king status
    function The_king_in_danger() {
        //find the king position
        var king;
        var king_position = [0, 0];
        if (player == 0) king = 0;
        else if (player == 1) king = 7;
        for (var j = 0; j < 8; j++) {
            for (var i = 0; i < 8; i++) {
                if (board[j][i] == king) { king_position = [j, i]; }
            }
        }
        switch_player();
        // check if there is a discover on the king
        king_warning = false;
        for (var j = 0; j < 8; j++) {
            for (var i = 0; i < 8; i++) {
                if ((board[j][i] > 6 && player == 1) || (board[j][i] < 6 && player == 0)) {
                    if (get_mouvement_domain(j, i)[king_position[0]][king_position[1]] == 2) king_warning = true;
                }
            }
        }
        switch_player();
        return king_warning;
    }
    // function of domain mouvement
    function get_mouvement_domain(y, x) {
        mouvement_domain = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]];
        selected_piece = board[y][x];
        selected_square = [y, x]
        switch (true) {
            case selected_piece == 0 || selected_piece == 7:// King case
                // castle
                if (player == 0 && board[0][0] == 2 && board[0][1] == 6 && board[0][2] == 6 && board[0][3] == 6 && board[0][4] == 0 && castle_wk == 1) mouvement_domain[0][0] = 6;// white king castle in king side
                if (player == 0 && board[0][7] == 2 && board[0][6] == 6 && board[0][5] == 6 && board[0][4] == 0 && castle_wq == 1) mouvement_domain[0][7] = 6;// white king castle in queen side
                if (player == 1 && board[7][0] == 9 && board[7][1] == 6 && board[7][2] == 6 && board[7][3] == 6 && board[7][4] == 7 && castle_bk == 1) mouvement_domain[7][0] = 6;// black king castle in king side
                if (player == 1 && board[7][7] == 9 && board[7][6] == 6 && board[7][5] == 6 && board[7][4] == 7 && castle_bq == 1) mouvement_domain[7][7] = 6;// black king castle in queen side
                //right              
                if (y < 8 && y > -1 && x + 1 < 8 && x + 1 > -1) mouvement_domain[y][x + 1] = check_the_squear_root(board[y][x + 1], player);
                //top right
                if (y + 1 < 8 && y + 1 > -1 && x + 1 < 8 && x + 1 > -1) mouvement_domain[y + 1][x + 1] = check_the_squear_root(board[y + 1][x + 1], player);
                //top
                if (y + 1 < 8 && y + 1 > -1 && x < 8 && x > -1) mouvement_domain[y + 1][x] = check_the_squear_root(board[y + 1][x], player);
                // top left
                if (y + 1 < 8 && y + 1 > -1 && x - 1 < 8 && x - 1 > -1) mouvement_domain[y + 1][x - 1] = check_the_squear_root(board[y + 1][x - 1], player);
                // left
                if (y < 8 && y > -1 && x - 1 < 8 && x - 1 > -1) mouvement_domain[y][x - 1] = check_the_squear_root(board[y][x - 1], player);
                // bottom left
                if (y - 1 < 8 && y - 1 > -1 && x - 1 < 8 && x - 1 > -1) mouvement_domain[y - 1][x - 1] = check_the_squear_root(board[y - 1][x - 1], player);
                //bottom
                if (y - 1 < 8 && y - 1 > -1 && x < 8 && x > -1) mouvement_domain[y - 1][x] = check_the_squear_root(board[y - 1][x], player);
                //bottom right
                if (y - 1 < 8 && y - 1 > -1 && x + 1 < 8 && x + 1 > -1) mouvement_domain[y - 1][x + 1] = check_the_squear_root(board[y - 1][x + 1], player);
                break;
            case selected_piece == 1 || selected_piece == 8:// Queen case
                diagonal_move(y, x, player);
                straight_move(y, x, player);
                break;
            case selected_piece == 2 || selected_piece == 9:// Rock case
                straight_move(y, x, player);
                break;
            case selected_piece == 3 || selected_piece == 10:// bishop case
                diagonal_move(y, x, player);
                break;
            case selected_piece == 4 || selected_piece == 11:// knight case
                //right  right            
                if (y - 1 < 8 && y - 1 > -1 && x + 2 < 8 && x + 2 > -1) mouvement_domain[y - 1][x + 2] = check_the_squear_root(board[y - 1][x + 2], player);
                //right left
                if (y + 1 < 8 && y + 1 > -1 && x + 2 < 8 && x + 2 > -1) mouvement_domain[y + 1][x + 2] = check_the_squear_root(board[y + 1][x + 2], player);
                //top right
                if (y + 2 < 8 && y + 2 > -1 && x + 1 < 8 && x + 1 > -1) mouvement_domain[y + 2][x + 1] = check_the_squear_root(board[y + 2][x + 1], player);
                // top left
                if (y + 2 < 8 && y + 2 > -1 && x - 1 < 8 && x - 1 > -1) mouvement_domain[y + 2][x - 1] = check_the_squear_root(board[y + 2][x - 1], player);
                // left right
                if (y + 1 < 8 && y + 1 > -1 && x - 2 < 8 && x - 2 > -1) mouvement_domain[y + 1][x - 2] = check_the_squear_root(board[y + 1][x - 2], player);
                // left left
                if (y - 1 < 8 && y - 1 > -1 && x - 2 < 8 && x - 2 > -1) mouvement_domain[y - 1][x - 2] = check_the_squear_root(board[y - 1][x - 2], player);
                //bottom left
                if (y - 2 < 8 && y - 2 > -1 && x - 1 < 8 && x - 1 > -1) mouvement_domain[y - 2][x - 1] = check_the_squear_root(board[y - 2][x - 1], player);
                //bottom right
                if (y - 2 < 8 && y - 2 > -1 && x + 1 < 8 && x + 1 > -1) mouvement_domain[y - 2][x + 1] = check_the_squear_root(board[y - 2][x + 1], player);
                break;
            case (selected_piece == 5 && y < 7):// white pawn  case  
                if (board[y + 1][x] == 6) mouvement_domain[y + 1][x] = 1;
                else if (board[y + 1][x] < 6) mouvement_domain[y + 1][x] = 4;
                if (board[y + 1][x + 1] > 6) mouvement_domain[y + 1][x + 1] = 2;
                if (board[y + 1][x - 1] > 6) mouvement_domain[y + 1][x - 1] = 2;
                if (y == 1 && board[3][x] == 6 && board[2][x] == 6) mouvement_domain[y + 2][x] = 1;
                //en passant case
                if (x < 6 && mouvement[mouvement.length - 1] == "Black Pawn from " + horizontal_axe[x + 1] + "7 to " + horizontal_axe[x + 1] + "5" && y == 4) mouvement_domain[5][x + 1] = 5;
                if (x > 0 && mouvement[mouvement.length - 1] == "Black Pawn from " + horizontal_axe[x - 1] + "7 to " + horizontal_axe[x - 1] + "5" && y == 4) mouvement_domain[5][x - 1] = 5;
                break;
            case (selected_piece == 12 && y>0):// black pawn  case  
                if (board[y - 1][x] == 6) mouvement_domain[y - 1][x] = 1;
                if (board[y - 1][x] > 6) mouvement_domain[y - 1][x] = 4;
                if (board[y - 1][x + 1] < 6) mouvement_domain[y - 1][x + 1] = 2;
                if (board[y - 1][x - 1] < 6) { mouvement_domain[y - 1][x - 1] = 2 };
                if (y == 6 && board[5][x] == 6 && board[4][x] == 6) { mouvement_domain[4][x] = 1 };
                //en passant case
                if (x < 6 && mouvement[mouvement.length - 1] == "White Pawn from " + horizontal_axe[x + 1] + "2 to " + horizontal_axe[x + 1] + "4" && y == 3) mouvement_domain[2][x + 1] = 5;
                if (x > 0 && mouvement[mouvement.length - 1] == "White Pawn from " + horizontal_axe[x - 1] + "2 to " + horizontal_axe[x - 1] + "4" && y == 3) mouvement_domain[2][x - 1] = 5;
                break;
        }
        return mouvement_domain;

    }
    // castle
    var castle_bk = true,castle_bq = true, castle_wk = true, castle_wq = true;
    function check_castling_right() {
        if (board[7][7] != 9 || board[7][4] != 7) {  castle_bk = false; }
        if (board[7][0] != 9 || board[7][4] != 7) {  castle_bq = false; }
        if (board[0][0] != 2 || board[0][4] != 0) {  castle_wk = false; }
        if (board[0][7] != 2 || board[0][4] != 0) {  castle_wq = false; }

    }
    // pawn_promotion funciton
    function pawn_promotion(y, x, promotion_piece) {
        if((board[y][x] == 5 || board[y][x] == 12) && (y == 0 || y == 7)){
            board_with_time.pop();
            board_with_time_lenght -=1;
            switch_player();
            if (promotion_piece == 0) {
                if (player == 0) { dialog.innerHTML += "<dialog open><p>Your pawn promoted!, select the piece</p><button onclick='pawn_promotion(" + y + "," + x + ",1);'><img src='icon/White Queen.png' height='50px'  ></button><button onclick='pawn_promotion(" + y + "," + x + ",2);'><img src='icon/White Rook.png' height='50px'  ></button><button onclick='pawn_promotion(" + y + "," + x + ",3);'><img src='icon/White Bishop.png' height='50px'  ></button><button onclick='pawn_promotion(" + y + "," + x + ",4);'><img src='icon/White Knight.png' height='50px'  ></button><hr></dialog>"; refresh_board(-1, 0, 0); }
                else if (player == 1) { dialog.innerHTML += "<dialog open><p>Your pawn promoted!, select the piece</p><button onclick='pawn_promotion(" + y + "," + x + ",8);'><img src='icon/Black Queen.png' height='50px'  ></button><button onclick='pawn_promotion(" + y + "," + x + ",9);'><img src='icon/Black Rook.png' height='50px'  ></button><button onclick='pawn_promotion(" + y + "," + x + ",10);'><img src='icon/Black Bishop.png' height='50px'  ></button><button onclick='pawn_promotion(" + y + "," + x + ",11);'><img src='icon/Black Knight.png' height='50px'  ></button><hr></dialog>"; refresh_board(-1, 0, 0); }
                refresh_board(-1,0,0);
            }
            else {

                mouvement.pop();// remove the move of moving the pawn to the board edge
                var q = from_to[0][0] + 1, w = y + 1;           
                mouvement.push(piece[board[y][x]] + " from " + horizontal_axe[from_to[0][1]] + q + " to in " + horizontal_axe[x] + w + "and promonte to " + piece[promotion_piece]); 
                board[y][x] = promotion_piece;
                save_board_to_history();
                dialog.innerHTML = '';
                refresh_board(0,0,0);
            }
        }
    }
    function save_board_to_history(){

        board_with_time[board_with_time_lenght]=board+"";
        board_with_time[board_with_time_lenght]=board_with_time[board_with_time_lenght].split(',');
        var instant_double_array = board;
        for (var j=0;j<8;j++){
            for (var i =0;i<8;i++){
                board_with_time[board_with_time_lenght][i+j*8] =parseInt(board_with_time[board_with_time_lenght][i+j*8]);
            }
        }   
        board_with_time_lenght +=1;
        return board_with_time;
        
    }
    function wrong_move(){
        board_with_time.pop();
        board_with_time_lenght -=1;
        var z = board_with_time[board_with_time_lenght-1];
        for (var j=0;j<8;j++){
            for (var i =0;i<8;i++){
                board[j][i] =z[i+j*8];
            }
        }  
        mouvement.pop();
        save_board_to_history(); 
        refresh_board(0,0,0);
    }
    // ------------- Checkmate Section NOT USED ______________________________
    function checkmate(){
        var danger=true;
        if (The_king_in_danger()){
            for(var i=0;i<8 && danger;i++){
                for(var j=0;j<8 && danger;j++){

                    if ((board[j][i] <6 && player ==0)||(board[j][i] >6 && player ==1)){ 

                        for(var q=0;q<8 && danger;q++){
                            for (var w=0;q<8 && danger;q++){

                                from(j,i);
                                if(to_modified_for_checkmate(w,q)==0){
                                    danger=false;
                                
                                
                                }
                            }
                        }
                    }
                }
            }
        }
        if (danger){game_over();}
    }
    function to_modified_for_checkmate(y,x){
        selected_square = board[y][x];
        selected_piece1 = board[from_to[0][0]][from_to[0][1]];
        switch (mouvement_domain[y][x]) {
            case 0:
                break;
            case 1:
                from_to[1] = [y, x]// set an instant value 
                board[from_to[0][0]][from_to[0][1]] = 6; // make the square of the selected piece vide 
                board[y][x] = selected_piece1;// set the selected piece on the selected square
                save_board_to_history();// save the current board in list 
                mouvement.push("this move will be removed");
                if(The_king_in_danger()==false)return 0;
                wrong_move();
                break;
            case 2:
                from_to[1] = [y, x];
                board[from_to[0][0]][from_to[0][1]] = 6;
                eated_piece = board[y][x];
                board[y][x] = selected_piece1;
                save_board_to_history();// save the current board in list 
                mouvement.push("this move will be removed");
                if(The_king_in_danger()==false)return 0;
                wrong_move();
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                // en passant move
                from_to[1] = [y, x]
                board[from_to[0][0]][from_to[0][1]] = 6;
                if (player == 0) {eated_piece =12; board[y + 1][x] = 6;board[y - 1][x] =6;}// selecte the eated piece black pawn 12 ; make the from square vide ; replace the black pawn (eated ) by vide
                else if (player == 1) {eated_piece = 5; board[y - 1][x] = 6;board[y + 1][x] =6;}// selecte the eated piece white pawn 5 ; make the from square vide ; replace the white pawn (eated ) by vide                
                board[y][x] = selected_piece1;// the to square white pawn or black pawn
                out_pieces.push(eated_piece);// add the eated piece to the list
                save_board_to_history();// save the current board in list 
                mouvement.push("this move will be removed");
                if(The_king_in_danger()==false)return 0;
                wrong_move();
                break;
            case 6:
                //castle
                switch (true) {
                    case y == 7 && x == 7:
                        board[7][7] = 6;
                        board[7][6] = 7;
                        board[7][5] = 9;
                        board[7][4] = 6;
                        from_to[1] = [y, x]
                        save_board_to_history();// save the current board in list 
                        mouvement.push("this move will be removed");
                        if(The_king_in_danger()==false)return 0;
                        wrong_move();
                        break;
                    case y == 7 && x == 0:
                        board[7][0] = 6;
                        board[7][1] = 6;
                        board[7][2] = 7;
                        board[7][3] = 9;
                        from_to[1] = [y, x]
                        save_board_to_history();// save the current board in list 
                        mouvement.push("this move will be removed");
                        if(The_king_in_danger()==false)return 0;
                        wrong_move();
                        break;
                    case y == 0 && x == 0:
                        board[0][0] = 6;
                        board[0][1] = 6;
                        board[0][2] = 0;
                        board[0][3] = 2;
                        from_to[1] = [y, x]
                        save_board_to_history();// save the current board in list 
                        mouvement.push("this move will be removed");
                        if(The_king_in_danger()==false)return 0;
                        wrong_move();
                        break;
                    case y == 0 && x == 7:
                        board[0][7] = 6;
                        board[0][6] = 0;
                        board[0][5] = 2;
                        board[0][4] = 6;
                        from_to[1] = [y, x]
                        save_board_to_history();// save the current board in list 
                        mouvement.push("this move will be removed");
                        if(The_king_in_danger()==false)return 0;
                        wrong_move();
                        break;


                    }
                }
    }
    function game_over(){
        console.log("game over")
    }

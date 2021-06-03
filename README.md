# Chess
A basic chess game using javascript
it s a strategy game , 2 player , turn , eat the king to win
                in deep :
                    every piece on the board have a way of mouvement . straight , diagonal , diagonal and straight , and some special way of move like the knight
                    you cant eat your own pieces
                    not all the pices can jump over pieces
                    castle rule
                    en passent rule
                    when your king is on threat you have to move your pieces to stop the threat
                the code :
                    first i have declared some variable and get some element from the html document
                    i give every piece a number 
                    the board have tow dimension :
                        1. the place of every piece on the board 
                            it s an array contain numbers represent the pieces
                        2. the domain of every selected piece on the board (respect all the general and specifique roule ) 
                            it s an array contain numbers represent the situation of every square relative to the selected piece 
                    refresh board function with a specifique situation(unselected piece ,selected piece, pawn promotion )
                        clear the out pice pieces
                        print the out pieces 
                        check if the king still can castle (void function)
                        print the player turn indicator
                        print the mouvement list 
                        clear the board 
                        print the board following the situation 
                    switch player function
                    The base mouvement functions :
                        straight move function 
                        diagonla move function
                    check square root function (check the square based on the type of the piece on this square (vide ,enemy piece , ower piece) and return the situation of the square)
                    check square function (chekc the situation of the square based on the previous function and edit the domain value on the square (you can move here , you cant junp over this square , ....))
                    from function :
                        knowing the selected piece 
                        check if its the player piece 
                        get the domain of mouvement function (we gona talk about it later )
                        refresh the board on a selceted piece situation
                    to function :
                        knowing the selected piece (from the "from function")
                        knowing the selected square 
                        based on the return of the mouvement domain function we know the case (you cant reach ,move , eat ,jump over piece ,eat your own piece ,en passant move ,castling case)
                        the general step on every case :
                             make the response , save the board ,check if the king is on danger , switch player , refresh board as unselected piece , check pawn promotion
                    the king in danger function :
                        find the place of the king 
                        check if there an enemy piece can eat the king 
                        return the situation 
                    get mouvement domain function (y,x) :
                        clear the mouvement domain double dimension array
                        knowing the selected piece 
                        knowing the selected square 
                        get the domain for the selected piece 
                            king case 
                                castle 
                                movement 
                            queen case
                            rock case
                            bishop case
                            knight case
                            white pawn case
                            black pawn case
                        every case return his own domain 
                        return the domain
                    check castilng right function (if the king move the castle right =false ...)
                    pawn promotion funciton :
                        check if the pawn is on the end of the board 
                        bcs the pawn promotion function is after the move so we have to :
                            remove the last move
                            return to the past situation 
                        show dialog to selecte to what promote
                    save board to history function :
                        store the situatin of the board when we call it
                    wrong move function 
                        remove the last situation of the board from the history
                        return to the last situation 
                    Chekck mate section is not used bcs is not ready .                   


                the logic ordre :
                    you select a piece ----> get the domain of mouvement for this piece ----> refresh the board and displaying the domain as dots
                    you select a square ---- > get the situation of the square selected ----> response(move , eat , you cant move ....) -----> refresh the board displaying the place of the pieces
                    change turn if the the move has done

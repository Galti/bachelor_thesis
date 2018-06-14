pragma solidity ^0.4.23;

contract Lottery {
    address public owner;
    uint public maxNumberOfPlayers = 2;
    uint public ticketPrice = 0.02 ether;
    Game[] public History;
    Game public currentGame;

    constructor() public {
        owner = msg.sender;
        initializeGame(0);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    struct Game {
        Ticket[] tickets;
        address winner;
        uint id;
        bool isEnded;
        bool isTicketsSoldOut;
        bool isNumberRevelationEnded;
    }
    
    struct Ticket {
        address buyer;
        bytes32 hashOfTheNumber;
        uint number;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        owner = newOwner;
    }

    function checkBuyerExists(address buyer) public view returns(bool){
        // if maxNumberOfPlayers > 255 change type of i
        for(uint8 i = 0; i < currentGame.tickets.length; i++){
            if(currentGame.tickets[i].buyer == buyer) return true;
        }
        return false;
    }

    function buyTicket(bytes32 numberHash) public payable returns(uint) {
        require(!currentGame.isTicketsSoldOut);
        require(!checkBuyerExists(msg.sender));
        require(msg.value == ticketPrice);
        
        Ticket memory ticket = Ticket({
            buyer: msg.sender,
            hashOfTheNumber: numberHash,
            number: 0
        });
        
        currentGame.tickets.push(ticket);
        checkTicketsBox();
        return currentGame.id;
    }

    function checkTicketsBox() public payable returns(uint){
        if (currentGame.tickets.length == maxNumberOfPlayers) {
            currentGame.isTicketsSoldOut = true;
            return 0;
        } else {
            return maxNumberOfPlayers - currentGame.tickets.length;
        }
    }
    
    function shouldRevealTheNumber() public view returns(bool) {
        return currentGame.isTicketsSoldOut;
    }
    
    function getMyHistory() public payable returns(uint[], address[]) {
        address[] memory winners = new address[](History.length);
        uint[] memory idsOfGames = new uint[](History.length);
        
        uint index = 0;
        for(uint i = 0; i < History.length; i++) {
            for(uint j = 0; j < History[i].tickets.length; j++) {
                if(History[i].tickets[j].buyer == msg.sender) {
                    winners[index] = History[i].winner;
                    idsOfGames[index] = History[i].id;
                    index++;
                    break;
                }
            }
        }
        return (idsOfGames, winners);
    }
    
    function revealTheNumber(uint number) public {
        uint8 indexOfBuyer;
        for (uint8 i; i < currentGame.tickets.length; i++) {
            if (msg.sender == currentGame.tickets[i].buyer) {
                indexOfBuyer = i;
                break;
            }
        }
        // require(keccak256(number, msg.sender) == currentGame.tickets[indexOfBuyer].hashOfTheNumber);
        currentGame.tickets[indexOfBuyer].number = number;
        if (shouldFindTheWinner()) {
            currentGame.winner = findTheWinner();
            transferMoney(currentGame.winner);
            createNewGame();
        }
    }
    
    function shouldFindTheWinner() public payable returns(bool) {
        for(uint8 i = 0; i < currentGame.tickets.length; i++) {
            if (currentGame.tickets[i].number == 0) {
                return false;
            }
        }
        
        currentGame.isNumberRevelationEnded = true;
        return true;
    }

    function findTheWinner() public view returns (address) {
        require(currentGame.isNumberRevelationEnded);
        uint winnerIndex = currentGame.tickets[0].number;
        for(uint8 i = 1; i < currentGame.tickets.length; i++) {
            winnerIndex ^= currentGame.tickets[i].number;
        }
        
        winnerIndex %= maxNumberOfPlayers;
        return currentGame.tickets[winnerIndex].buyer;
    }
    
    function transferMoney(address winner) public payable {
        require(currentGame.isNumberRevelationEnded);
        winner.transfer(maxNumberOfPlayers * ticketPrice);
    }
    
    function createNewGame() public payable {
        currentGame.isEnded = true;
        History.push(currentGame);
        uint nextGameId = currentGame.id + 1;
        delete currentGame;
        initializeGame(nextGameId);
    }
    
    function initializeGame(uint id) public payable {
        currentGame.id = id;
        currentGame.isEnded = false;
        currentGame.isTicketsSoldOut = false;
        currentGame.isNumberRevelationEnded = false;
    }
    
    function getCurrentGameId() public view returns(uint) {
        return currentGame.id;
    }
    
    function getCurrentGameTickets() public view returns(address[], uint[]) {
        address[] memory ticketBuyers = new address[](currentGame.tickets.length);
        uint[] memory buyerRevealedNumbers = new uint[](currentGame.tickets.length);
        
        for(uint i = 0; i < currentGame.tickets.length; i++) {
            ticketBuyers[i] = currentGame.tickets[i].buyer;
            buyerRevealedNumbers[i] = currentGame.tickets[i].number;
        }
        
        return (ticketBuyers, buyerRevealedNumbers);
    }
    
    function getCurrentGameStates() public view returns(bool, bool) {
        return (currentGame.isTicketsSoldOut, currentGame.isNumberRevelationEnded);
    }
    
    function getGameWinner(uint id) public view returns(address) {
        for (uint i = 0; i < History.length; i++) {
            if (id == History[i].id) {
                return History[i].winner;
            }
        }
    }
}
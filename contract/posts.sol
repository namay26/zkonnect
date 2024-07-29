// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;


contract MappingPubkey {
    mapping (address => string) private pubKeyToDisplayName;

    function setpubKeyToDisplayName( string memory displayName ) public {
        pubKeyToDisplayName[msg.sender] = displayName; //Address of the account that called mapped to its display name
    }
    
    function getDisplayName(address user) public view returns ( string memory ){
        return pubKeyToDisplayName[user];
    }
} 

interface IMappingPubkey {
    function getDisplayName(address user) external view returns ( string memory );
}

contract Posts {
    struct Post{
        uint postIndex; // Unique Identification of Post
        uint postTime;
        string CIDHash;
        uint Reward; //Initialises with value 0
        //string flair; What else can be added?
    }
    mapping (string => Post[]) private userPosts;
    Post[] public allPosts;

    constructor(address _mappingPubkeyAddress) {
        mappingPubkeyContract = IMappingPubkey(_mappingPubkeyAddress);
    }
    IMappingPubkey private mappingPubkeyContract;
    
    function createPost(Post memory post) public {
        string memory displayName = mappingPubkeyContract.getDisplayName(msg.sender);
        require(bytes(displayName).length > 0, "Display name not set");
        allPosts.push(post);
        userPosts[displayName].push(post);
    }

    function getUserPosts(address userAdd) public view returns (Post[] memory){
        string memory displayName = mappingPubkeyContract.getDisplayName(userAdd);
        return userPosts[displayName];
    }

    function getAllPosts() public view returns(Post[] memory){
        return allPosts;
    }
}

contract Reward{
    event Transfer(address indexed from, address indexed to, uint amount);
    
    function transferFunds(address payable recipient, uint amount) public payable {
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient balance in the account");
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");
         emit Transfer(msg.sender, recipient, amount);
    }
    receive() external payable {}
}

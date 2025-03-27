// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target; //Target amount to be raised
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    // mapping is used to map an object to an instance
    mapping(uint256 => Campaign) public campaigns;

    // keep track of the number of campaigns
    uint256 public numberOfCampaigns = 0;

    // functions
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            campaign.deadline < block.timestamp,
            "The deadline should be a date in the future!!"
        );

        // filling out the attributes of the campaign object
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;
        campaign.amountCollected = 0;

        // incrementing the number of campaigns
        numberOfCampaigns++;

        // Returns the index of the created campaign
        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        // Accessing the specific campaign using its id
        Campaign storage campaign = campaigns[_id];

        // store the donator
        campaign.donators.push(msg.sender);

        // add the donation
        campaign.donations.push(amount);

        // confirmation
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        // Incrementing the amount during collection
        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        // Returning the donators and donations from the campaign mapping
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    // function getCampaigns() public view returns (Campaign[] memory) {
    //     // Creating a new campaign array of as many empty elements as there are campaigns
    //     Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

    //     // loop and populate
    //     for (uint i = 0; 1 < numberOfCampaigns; i++) {
    //         Campaign storage item = campaigns[i];

    //         allCampaigns[i] = item;
    //     }
    //     return allCampaigns;
    // }
    function getCampaigns() public view returns (Campaign[] memory) {
        // Creating a new campaign array of as many elements as there are campaigns
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        // Loop and populate
        for (uint i = 0; i < numberOfCampaigns; i++) {
            // ✅ Fixed condition
            allCampaigns[i] = campaigns[i]; // ✅ Direct assignment
        }

        return allCampaigns;
    }
}

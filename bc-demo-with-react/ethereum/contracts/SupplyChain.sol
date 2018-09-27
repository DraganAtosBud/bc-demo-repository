pragma solidity ^0.4.6;

contract SupplyChainFactory
{
  mapping(address=>address[]) public deployedSupplyChainsByBuyer;
  mapping(address=>address[]) public deployedSupplyChainsBySeller;
  address[] public deployedSupplyChains;

  function createSupplyChain(string buyerName, string orderDescription, uint orderPrice, address sellerAddress, string sellerName) public payable {
    require(msg.value >= orderPrice);

    uint256 orderNo = deployedSupplyChains.length + 1000;
    address newSupplyChain = (new SupplyChain).value(msg.value)(msg.sender, buyerName, orderDescription, orderPrice, sellerAddress, orderNo, sellerName);
    address[] storage existingAddressesByBuyer = deployedSupplyChainsByBuyer[msg.sender];
    existingAddressesByBuyer.push(newSupplyChain);
    deployedSupplyChainsByBuyer[msg.sender] = existingAddressesByBuyer;

    address[] storage existingAddressesBySeller = deployedSupplyChainsBySeller[sellerAddress];
    existingAddressesBySeller.push(newSupplyChain);
    deployedSupplyChainsBySeller[sellerAddress] = existingAddressesBySeller;
    deployedSupplyChains.push(newSupplyChain);
  }

  function getDeployedSupplyChainsByBuyer() public view returns (address[]) {
      return deployedSupplyChainsByBuyer[msg.sender];
  }

  function getDeployedSupplyChainsBySeller() public view returns (address[]) {
      return deployedSupplyChainsBySeller[msg.sender];
  }

  function getDeployedSupplyChains() public view returns (address[]) {
      return deployedSupplyChains;
  }

}

contract SupplyChain
{
    struct Order
    {
        uint Number;
        string Description;
        uint Price;
        string Status; // Placed, Accepted, Rejected, ShippingInProgress, ShippingFinished, Closed
        string StatusMessage;
    }

    struct Shipping
    {
        uint Number;
        string Status; // NotStarted, InProgress, Cancelled, ReplacedByNewShipping, ConfirmedSuccessful
    }

    struct ShippingStep
    {
        uint ShippingNumber;
        string Company;
        address CompanyAddress;
        string Location;
        uint256 Timestamp;
        string StatusMessage;
        string PackageStatus; // OK (default), Lost, Damaged
    }
    modifier restrictedUser() {
            require(msg.sender == buyerAddress);
            _;
        }

    modifier restrictedSeller() {
        require(msg.sender == sellerAddress);
        _;
    }

    Order order;
    Shipping[] shippings;
    ShippingStep[] shippingSteps;

    string buyer;
    string seller;

    address buyerAddress;
    address sellerAddress;

    address temporaryMoneyStorageAddress; //set default value

    constructor (address creatorAddress, string buyerName, string orderDescription, uint orderPrice, address sellerAddr, uint256 orderNo, string sellerName) public payable {
        require(msg.value >= orderPrice);
        buyerAddress = creatorAddress;
        buyer = buyerName;
        order.Description = orderDescription;
        order.Price = orderPrice;
        order.Status = "Placed";
        sellerAddress = sellerAddr;
        order.Number = orderNo;
        seller = sellerName;

        // send money from buyerAddress to temporaryMoneyStorageAddress (contract)
        //buyerAddress.transfer(orderPrice);

    }

    function rejectOrder(string orderStatusMessage) public {

        order.Status = "Rejected";
        order.StatusMessage = orderStatusMessage;
        buyerAddress.transfer(address(this).balance);

        // return money from temporaryMoneyStorageAddress (contract) to buyerAddress
        //buyerAddress.transfer(order.Price);

    }

    function startShipping(string shippingCompany, string statusMessage, string location) public restrictedSeller {

        order.Status = "Shipping In Progress";

        Shipping memory s;
        s.Number = shippings.length + 1000;
        s.Status = "In Progress";
        shippings.push(s);

        ShippingStep memory ss;
        ss.ShippingNumber = s.Number;
        ss.Company = shippingCompany;
        ss.CompanyAddress = msg.sender;
        ss.Location = location;
        ss.Timestamp = now;
        ss.StatusMessage = statusMessage;
        ss.PackageStatus = "OK";
        shippingSteps.push(ss);

    }

    function updateShipping(string shippingCompany, string statusMessage, string location, string packageStatus) public {

        ShippingStep memory ss;
        ss.ShippingNumber = shippings[shippings.length - 1].Number;
        ss.Company = shippingCompany;
        ss.CompanyAddress = msg.sender;
        ss.Location = location;
        ss.Timestamp = now;
        ss.StatusMessage = statusMessage;
        ss.PackageStatus = packageStatus;
        shippingSteps.push(ss);

    }

    function confirmReceivedByBuyer(string statusMessage, string location) public restrictedUser{

        order.Status = "Shipping Finished";
        shippings[shippings.length - 1].Status = "Confirmed by user - Successful";

        ShippingStep memory ss;
        ss.ShippingNumber = shippings[shippings.length - 1].Number;
        ss.Company = buyer;
        ss.CompanyAddress = buyerAddress;
        ss.Location = location;
        ss.Timestamp = now;
        ss.StatusMessage = statusMessage;
        ss.PackageStatus = "";
        shippingSteps.push(ss);

        // send money from temporaryMoneyStorageAddress (contract) to sellerAddress
        sellerAddress.transfer(address(this).balance);

    }

    function getOrderInfo() public view returns (string, string, uint, string, uint) {

        return (buyer, seller, order.Number, order.Description, order.Price);

    }

    function getOrderStatus() public view returns (string) {

        return order.Status;

    }

    function getShippingStatus() public view returns (string) {

        if (shippings.length > 0) {
            return shippings[shippings.length - 1].Status;
        }
        else {
            return "Shipping Not Started";
        }

    }

    function getShippingEntitiesCount() public view returns (uint) {

        return shippingSteps.length;

    }

    function getShippingEntity(uint index) public view returns (string) {

        return shippingSteps[index].Company;

    }

    function getTimestamp(uint index) public view returns (uint256) {

        return shippingSteps[index].Timestamp;

    }

    function getCurrentHolder() public view returns (string) {

        uint shippingStepsCount = shippingSteps.length;
        if (shippingStepsCount > 0) {
            return shippingSteps[shippingStepsCount - 1].Company;
        }
        else {
            return "";
        }

    }

   function getShippingStep(uint index) public view returns (uint, string, address, string, uint256, string) {

        return (
          shippingSteps[index].ShippingNumber,
          shippingSteps[index].Company,
          shippingSteps[index].CompanyAddress,
          shippingSteps[index].Location,
          shippingSteps[index].Timestamp,
          shippingSteps[index].StatusMessage
        );

    }

    function refund() public {
        // send money from temporaryMoneyStorageAddress (contract) to buyer
        buyerAddress.transfer(address(this).balance);
    }

    function closeOrder() public {

        order.Status = "Closed";

    }

}

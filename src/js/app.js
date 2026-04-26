let contractAddress;
let tronWeb;

if (typeof metacoinConfig !== 'undefined') {
  contractAddress = metacoinConfig.contractAddress;
  try {
    tronWeb = new TronWeb(
      metacoinConfig.fullHost,
      metacoinConfig.fullHost,
      metacoinConfig.fullHost,
      metacoinConfig.privateKey
    );
  } catch (err) {
    console.error('TronWeb initialization failed:', err);
  }
} else {
  console.warn('metacoinConfig is not defined. Please run `npm run migrate` or configure the app.');
}

const App = {
  tronWebProvider: null,
  contracts: {},
  accounts: [],
  contractAddress: contractAddress,
  feeLimit: 100000000,
  callValue: 0,
  abi: [
    {
      "inputs": [
        {
          "name": "initialBalance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "receiver",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "sendCoin",
      "outputs": [
        {
          "name": "sufficient",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "getBalanceInEth",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "getBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getOwner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],

  init: async function () {
    if (!tronWeb || !this.contractAddress) {
      alert('The app is not configured. Please run `npm run migrate`');
      return;
    }

    try {
      this.accounts = [
        tronWeb.address.fromPrivateKey(metacoinConfig.privateKey)
      ];

      const account = await tronWeb.createAccount();
      this.accounts.push(account.address.base58);

      $("#contractAddress").text(this.contractAddress);
      $("#accountA").text(this.accounts[0]);
      $("#accountB").text(this.accounts[1]);

      await this.initData();
      this.bindEvents();
    } catch (err) {
      console.error('App initialization failed:', err);
    }
  },

  initData: async function () {
    $("#loading").show();
    $("#commit").prop('disabled', true);

    try {
      const balanceA = await this.triggerContract('getBalance', [this.accounts[0]]);
      $("#dev_old_a").html(balanceA.toNumber());

      const balanceB = await this.triggerContract('getBalance', [this.accounts[1]]);
      $("#dev_old_b").html(balanceB.toNumber());
    } catch (err) {
      console.error('Data initialization failed:', err);
    } finally {
      $("#loading").hide();
      $("#commit").prop('disabled', false);
    }
  },

  transfer: async function () {
    const count = $("#dev_count").val() || 0;
    const to = this.accounts[1];
    const amount = parseInt(count);

    $("#loading").show();
    $("#dev_count").val('');
    $("#commit").prop('disabled', true);

    try {
      await this.triggerContract('sendCoin', [to, amount]);
      await this.initData();
    } catch (err) {
      console.error('Transfer failed:', err);
      $("#loading").hide();
      $("#commit").prop('disabled', false);
    }
  },

  triggerContract: async function (methodName, args) {
    const myContract = await tronWeb.contract().at(this.contractAddress);

    let callSend = 'send';
    this.abi.forEach((val) => {
      if (val.name === methodName) {
        callSend = /payable/.test(val.stateMutability) ? 'send' : 'call';
      }
    });

    return myContract[methodName](...args)[callSend]({
      feeLimit: this.feeLimit,
      callValue: this.callValue || 0,
    });
  },

  bindEvents: function () {
    $(document).on('click', '#commit', () => {
      this.transfer();
    });
  }
};

$(() => {
  $(window).on('load', () => {
    App.init();
  });
});

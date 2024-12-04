const axios = require('axios')

const Add =  async (req, res) => {
    const url = "https://developers.flouci.com/api/generate_payment";
    const payload = {
        "app_token": process.env.FLOUCI_APP, 
        "app_secret": process.env.FLOUCI_SECRET,
        "amount": req.body.amount,
        "accept_card": "true",
        "session_timeout_secs": 1200,
        "success_link": "http://localhost:5000/success",
        "fail_link": "http://localhost:5000/fail",
        "developer_tracking_id": "da41a51b-027e-4f13-92e0-9c9db30d450a"
    }
    await axios
        .post(url, payload)
        .then(result => {
            res.send(result.data)
        } )
        .catch(err => console.error(err))
}

const Verify = async (req, res) => {
    const id_payment= req.params.id

    if (!id_payment) {
        return res.status(400).send('Payment ID is required');
    }


    const url = `https://developers.flouci.com/api/verify_payment/${id_payment}`

    axios.get(url, {
        headers : {
            'Content-Type': 'application/json',
            'apppublic': process.env.FLOUCI_APP,
            'appsecret': process.env.FLOUCI_SECRET
        }
    }
        )
    .then(result => {
        res.send(result.data)
    })
    .catch(err => {
        console.log(err.message)
    })
}
module.exports = {
   Add,
   Verify
  };
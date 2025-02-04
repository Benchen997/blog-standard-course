import Cors from 'micro-cors';
import stripeInit  from 'stripe';
import verifyStripe from "@webdeveducation/next-verify-stripe";
import clientPromise from "../../../lib/mongodb";

const cors = Cors({
    allowMethods: ['POST', 'HEAD'],
});


// we want to read raw data from stripe
export const config = {
    api: {
        bodyParser: false,
    },
}

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req, res) => {
    if (req.method === 'POST') {
        let event;
        try {
        event = await verifyStripe({
            req,
            stripe,
            endpointSecret
        })
        }catch (e) {
            console.log("error: ", e);
        }
        switch(event.type) {
            // 支付请求成功的情况下进行数据库写入
            case 'payment_intent.succeeded':{
                const client = await clientPromise;
                const db = client.db("BlogStandard");
                const paymentIntent = event.data.object;
                const auth0Id = paymentIntent.metadata.sub;
                // 2. update user profile with tokens, if user does not exist, create one
                const userProfile = db.collection("users").updateOne(
                    { auth0Id, },
                    {
                        $inc: { availableTokens: 10 },
                        $setOnInsert: { auth0Id, }
                    },
                    { upsert: true }
                )
                break;
            }
            // 未成功情况下显示错误
            default : {
                console.log("payment failed")
                break;
            }
        }
        res.status(200).json({received:true})
    }
}

export default cors(handler)
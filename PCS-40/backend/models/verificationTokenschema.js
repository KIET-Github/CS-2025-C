import mongoose  from "mongoose";
import bcrypt  from "bcrypt";

const verificationTokenSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        token: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            expires: 300,
            default: Date.now(),
        }
    },
    {
        timestampToken: true
    }
);

verificationTokenSchema.pre("save", async function (next) {

    if (!this.isModified("token")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.token = await bcrypt.hash(this.token, salt);

});

verificationTokenSchema.methods.matchToken = async function (enteredToken) {

    return await bcrypt.compare(enteredToken, this.token);

}

const verificationToken = mongoose.model.VerificationToken || mongoose.model("VerificationToken", verificationTokenSchema);

export default verificationToken;

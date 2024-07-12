import mongoose from "mongoose";
const Schema = mongoose.Schema;

const checkedReposSchema = new Schema(
	{
		org: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		checked: {
			type: Boolean,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

checkedReposSchema.index({org: 1, name: 1}, {unique: true});

const CheckedRepos = mongoose.model("CheckedRepos", checkedReposSchema);
export default CheckedRepos;
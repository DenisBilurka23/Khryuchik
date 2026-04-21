import { MongoClient, ServerApiVersion } from "mongodb";

const main = async () => {
  const email = process.argv[2]?.trim().toLowerCase();
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!email) {
    console.error("Usage: npm run admin:grant -- user@example.com");
    process.exit(1);
  }

  if (!uri || !dbName) {
    console.error("MONGODB_URI and MONGODB_DB must be set before running admin:grant");
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();

    const usersCollection = client.db(dbName).collection("users");
    const existingUser = await usersCollection.findOne({ email });

    if (!existingUser?._id) {
      console.error(`User with email ${email} was not found. Create the account first, then run this command again.`);
      process.exit(1);
    }

    await usersCollection.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          isAdmin: true,
          updatedAt: new Date(),
        },
      },
    );

    console.log(
      JSON.stringify(
        {
          ok: true,
          user: {
            id: existingUser._id.toString(),
            email,
            name: existingUser.name,
            isAdmin: true,
          },
        },
        null,
        2,
      ),
    );
  } finally {
    await client.close();
  }
};

void main();
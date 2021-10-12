`proof.zok` is a proof-of-concept ZKP for allowing anonymous authentication of a user. Right now this is pretty under-documented, refer to this blog post for more information: https://corbt.com/posts/private-recoverable-sso

The proof's arguments are as follows:

- `rootDigest` (public): the Merkle root of a set of valid FixedID users. It's stored on a public blockchain and a verifier should check to make sure the `rootDigest` matches one in the valid set.
- `appId` (public): Each app that wishes to allow anonymous verifications needs to select a unique `appId`. This is used as an input for the `appToken` and allows users to create anonymous accounts on multiple services without revealing that they all belong to the same backing FixedID.
- `nonce` (public): The app requesting a login token should provide a nonce and verify it in the proof to avoid replay attacks.
- `maxAliases` (public): The number of private aliases that the app allows for each user. For example, `1` means each user can only create one account.
- `appToken` (public): The app token is a persistent ID derived from your FixedID and the app you're signing into. Since it doesn't depend on your public key, it allows for transparent account recovery.
- `publicKey` (public): The public key associated with the login session authorized by the provided `appToken`.
- `fixedId` (private): The authorizing user's FixedID (https://fixedid.org/).
- `privateKey` (private): The private key associated with the login session authorized by the provided `appToken`.
- `password` (private): The user's immutable "password". If a user has to change their private key, they can recover access to FixedID authenticated accounts as long as they remember their password. An app that learns a user's password may be able to de-anonymize them (but still cannot impersonate them).
- `aliasId` (private): Users can create multiple distinct aliases for each app as long as they all have distinct `AliasId`s. An app can limit users to N aliases by only permitting proofs that show the `AliasId` is less than N. An ap that wants to enforce one account per human can require AliasId to always be 0.
- `merkleProof` (private): The Merkle proof demonstrating that the user has a valid leaf within the Merkle tree rooted at `rootDigest`.

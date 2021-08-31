I'd love to hear the community's thoughts on the following concept for an improved proof-of-personhood protocol I'm tentatively calling "FixedID." It fixes (hah) a number of issues with existing proof-of-personhood implementations that make it much more useful for authentication in both web2 and web3 apps, while fully preserving privacy.

## High-Level Overview

**Every person gets a permanent integer ID.** This is the key difference between FixedID and [existing](https://www.proofofhumanity.id/) [implementations](https://www.brightid.org/), and makes everything else possible. Instead of simply authenticating that a given wallet belongs to an individual, the system issues a static, immutable integer ID to each individual (their "FixedID"). The FixedID contract maintains a mapping of FixedIDs to wallets.

**FixedIDs are always recoverable.** An individual can recover their FixedID and assign it to a new wallet using one of three flows: (1) by using their existing FixedID wallet to sign a request, (2) by selecting "recovery users" who can then vote to recover the wallet, or finally (3) through an arbitration process on [Kleros](https://kleros.io/) or a similar platform. In all three cases, a waiting period is required before transferring ownership to allow for appeals.

**FixedIDs are ideal for authentication.** A FixedID can be used to sign in to a web2 or web3 application. This sign-in uses a zero-knowledge proof to assure the app that the account belongs to a unique human, while not revealing _which_ specific human it belongs to. In addition to eliminating sybil attacks, this removes the burden of account recovery from app creators.

**FixedIDs owners receive a basic income token.** FixedIDs will issue a built-in basic income token, with issuance calculated to produce a modest annual inflation of ~2.3%. All FixedID users in good standing will qualify to receive the token.

## Signing Up/Proving Personhood

The [ProofOfHumanity](https://www.proofofhumanity.id/) signup process is a good model here. ProofOfHumanity's process works as follows:

- Upload a picture of yourself and a video that involves speaking.
- Post collateral (currently 0.1ETH) that you'll forfeit if your account is judged fake.
- Find an existing PoH user willing to vouch that you're a real person (if your account is judged fake, they lose their account too).
- Wait 3 days to give challengers time to review the submission.
- If no one challenges your submission, your collateral is returned and your account is live.

There are a few modifications that I think would make this process more effective:

- The collateral should be deposited permanently. That way challengers are incentivized to always be scanning the network, instead of only focusing on new submissions. The permanently locked collateral can also be much smaller (~20USD) and still achieve its intended effect.
- Initially, no vouchers should be required to minimize barriers to entry. Over time the voucher requirements can be raised. When voucher requirements are added they should be weighted according to graph connectedness, to prevent eg. 5 scam accounts all just vouching for each other.
- The initial signup and posting of collateral can be done with a credit card to make the onboarding much simpler for non-crypto users. (I'll need legal advice on this, but a strong case can be made that since the collateral is never returned, you're just paying for the service of creating/verifying your account instead of buying a token, so a brokerage license/KYC shouldn't be required.)

## Challenging Fraudulent Users

Again, ProofOfHumanity's process here seems reasonable. As mentioned above, the primary modification I propose is dropping the challenge collateral significantly to ~$20 and locking it perpetually.

Since $20 is too little to justify a jury trial, this requires adding an extra "phase 0" arbitration. In the phase 0 arbitration, a challenger challenges a profile, submitting his evidence along with $20 in collateral. The challengee can review the evidence. If they think they're likely to lose (for example, they submitted their proof of personhood in the wrong format, or are indeed a fraudulent account), they can opt to do nothing, lose their account, and forfeit their $20 in collateral.

If they believe they can win the challenge, they can put up a larger stake of $400, which is enough to justify a jury trial. The challenger then has to either match the $400 deposit and take the challenge to trial, or drop it and forfeit their $20 challenge deposit.

Note that this exchange only works if gas fees are fairly low, so this whole contract will likely live in a rollup. 🙃

## Recovering a Lost FixedID

An important property of a FixedID is that it's assigned to one person for life. So no matter what happens—a lost or stolen private key, or even the case where someone intentionally _sold_ their FixedID or otherwise intentionally attacked the network—it should always be possible for a user to recover their FixedID. In this case, "recovering" a FixedID means assigning a new wallet to that FixedID within the FixedID smart contract. There are three ways to recover a FixedID:

1. **Individual Recovery:** a user can use the wallet currently associated with their FixedID to request that the FixedID be transferred to a new wallet. Once a request is initiated, the transfer happens after one week assuming it hasn't been challenged. During the intervening week, the FixedID continues behaving as normal, it's just associated with the previous account.
2. **Social Recovery:** A user can add "recovery users" to their FixedID to allow for social recovery. A majority of your recovery users can vote to associate your FixedID with a new wallet. When recovery users vote to recover your FixedID, a one-day waiting period begins. During the waiting period the account is locked and cannot be used for signing in or redeeming basic income. Adding or removing recovery users requires a 1-week delay before the change is live.
3. **Recovery through Arbitration:** Anyone can open an arbitration request to transfer a FixedID to themselves. This requires posting $400 in collateral in addition to the arbitration fee paid to jurors. It is the user's responsibility to prove that they are the same person who created the FixedID account, potentially in an adversarial context if someone else is currently controlling the account and wants to maintain it. If the transfer request is ruled fraudulent, the existing account owner keeps the $400 collateral.

These three methods escalate, so a group of recovery users can overrule an individual recovery, and the ruling from an arbitration court can overrule a group of recovery users.

## Authenticating with FixedID

FixedID is designed to be an ideal authentication scheme, appropriate for replacing username/password auth, Google/Facebook/Github SSO and signing in with an Ethereum wallet directly. I've run large user communities before, and fraud, sockpuppeting, vote brigading, repeated trolling, and other varieties of sybil attacks are problems that every community faces. FixedID can help here, while still preserving user privacy! (Note, however, that for communities where ephemeral/throwaway accounts are an intended part of the UX FixedID login won't be appropriate.)

When an app requests that a user sign in with FixedID, it provides the user with an app-specific string (such as the app's URL). The user then returns an app token, which is a hash of the app-specific string concatenated with the user's private key, eg `AppToken = Hash("{app_specific_string}.{private_key}")`. Additionally, the user provides a zero-knowledge proof that (1) the hash was correctly constructed, and (2) the private key corresponds to some public key in the set of all public keys currently associated with a FixedID (without revealing which one).

This allows the user to demonstrate that they have a valid FixedID account, and also allows they server to verify that they have **only one** account on the service, since the `AppToken` would match an existing account if they already had one. It also preserves the user's privacy, since the app can't map the hash `AppToken` back to a specific FixedID. And finally, it moves the burden of account recovery off of the app entirely and onto the FixedID infrastructure. These are significant benefits for an app builder!

Additionally, this can be extended with an [Ethmail](https://ethmail.cc/)-like (but less centralized) service so each app is given a single-purpose address that forwards to the user's main email address.

_Note, however, that this scheme as written will break when a user recovers their FixedID to a new wallet. Further work is needed to handle that potentially difficult challenge._

## Attestations

There are many types of attestations that are conceptually tied to an individual and should not be transferrable, even by selling my private keys. For example, a DAO may attest that I'm a member, a school may attest that I have a valid degree, or a country may attest that I have a valid residency permit. These types of attestations can be issued against a user's FixedID, instead of against a specific address. That way they become both non-transferable and fully recoverable. Just as with possession of a FixedID itself, a user can generate a zero-knowledge proof that they possess a FixedID with a specific attestation, without revealing precisely who they are.

## Basic Income/Monetary Policy

All FixedID users will receive a basic income through a new token "Fixed Income" (FIN). There are three primary reasons to bake this into the protocol:

1. The issuance schedule described below will naturally reward early adopters heavily. This should drive initial adoption.
2. Controlling the issuance of FIN gives the protocol a way to punish users who try to subvert the protocol without actually removing their account (which we never want to do for legitimate people). FIN issuance can be locked or suspended for a time in response to eg. vouching for a fraudulent user.
3. It is my opinion that some amount of redistribution is fair, to partially counteract the vastly different circumstances individual humans are born into.

FIN will be issued at an initial rate of 100,000,000 tokens per year. This issuance rate will increase by 2.34% annually, leading to an overall long-term inflation rate of 2.28%. This inflation rate was chosen to (in the long term) double the total money supply every 30 years. The 30-year-doubling is somewhat arbitrary, but I chose it since that's the approximate length of one generation and this way each new generation gets something of a fresh start.

The FIN token will be released with no "pre-mine." The only way FIN is minted is through the standard issuance to FixedIDs.

Within each distribution period (tentatively once an hour), the total amount of FIN to be issued in that period will be calculated, and then distributed evenly among all active FixedID holders. This distribution scheme should incentivize early adopters to sign up, since **in the early days before the network becomes widely used the number of FIN tokens allotted to each user will be huge**.

The issuance dynamic is captured by the equations below:

- $$YearOneIssuance = 100,000,000$$
- $$IssuanceInflation = \sqrt[30]{2} \approx 1.02337389...$$
- $$annualIssuance(T) = YearOneIssuance * IssuanceInflation^{T}$$
- $$
        AnnualInflation = \lim_{T \to \infty} \left ( \frac{annualIssuance(T)}{\sum_{n=0}^{T-1}annualIssuance(n)} \right ) \approx 0.0228...
  $$
- $$annualIncome(T) = \frac{annualIssuance(T)}{count(ActiveFixedIDs)}$$

## Lots left to do!

As you can see, there's a huge scope of work here. I'd love feedback on the protocol. And separately, if you're interested in building a system that may one day be used to authenticate most of the planet, I'd love to hear from you! There's plenty to do and I'm looking for someone to tackle this with me. 🙂

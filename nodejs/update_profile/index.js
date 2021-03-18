const { KameleoLocalApiClient, BuilderForCreateProfile } = require('@kameleo/local-api-client');

(async () => {
    try {
        const client = new KameleoLocalApiClient({
            baseUri: 'http://localhost:5050',
            noRetryPolicy: true,
        });

        // Search all of the Base Profiles
        const baseProfileList = await client.searchBaseProfiles();

        // Create a new profile with recommended settings
        // Choose one of the BaseProfiles
        const createProfileRequest = BuilderForCreateProfile
            .forBaseProfile(baseProfileList[0].id)
            .setRecommendedDefaults()
            .build();
        let profile = await client.createProfile({ body: createProfileRequest });

        // Change every properties what you want to update
        profile.startPage = 'https://www.google.com';
        profile.canvas = 'off';

        // Send the update request and the response will be your new profile
        profile = await client.updateProfile(profile.id, { body: profile });

        // Start the profile
        await client.startProfile(profile.id);

        // Wait for 10 seconds
        await new Promise((r) => setTimeout(r, 10000));

        // Stop the profile
        await client.stopProfile(profile.id);
    } catch (error) {
        console.error(error);
    }
})();

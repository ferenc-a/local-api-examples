﻿using System;
using System.IO;
using System.Threading.Tasks;
using Kameleo.LocalApiClient;
using Kameleo.LocalApiClient.Models;

namespace ProfileSaveLoad
{
    class Program
    {
        static async Task Main()
        {
            var client = new KameleoLocalApiClient();
            client.SetRetryPolicy(null);

            // Search a Base Profiles
            var baseProfileList = await client.SearchBaseProfilesAsync();

            // Choose one of from BaseProfiles
            var createProfileRequest = BuilderForCreateProfile
                .ForBaseProfile(baseProfileList[0].Id)
                .Build();

            var profile = await client.CreateProfileAsync(createProfileRequest);

            // Start the profile
            await client.StartProfileAsync(profile.Id);

            // Wait for 10 seconds
            await Task.Delay(10000);

            // Stop the profile
            await client.StopProfileAsync(profile.Id);

            // save the profile to a given path
            var result = await client.SaveProfileAsync(profile.Id, new SaveProfileRequest(Path.Combine(Environment.CurrentDirectory,"test.kameleo")));
            Console.WriteLine("Profile has been saved to " + result.LastKnownPath);

            // You have to delete this profile if you want to load back
            await client.DeleteProfileAsync(profile.Id);

            // load the profile from the given url
            profile = await client.LoadProfileAsync(new LoadProfileRequest(Path.Combine(Environment.CurrentDirectory, "test.kameleo")));

            // Start the profile
            await client.StartProfileAsync(profile.Id);

            // Wait for 10 seconds
            await Task.Delay(10000);

            // Stop the profile
            await client.StopProfileAsync(profile.Id);
        }
    }
}
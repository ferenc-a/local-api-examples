import { KameleoLocalApiClient, BuilderForCreateProfile } from '@kameleo/local-api-client';
import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';

// This is the port Kameleo.CLI is listening on. Default value is 5050, but can be overridden in appsettings.json file
const kameleoPort = process.env.KAMELEO_PORT || 5050;
const kameleoCliUri = `http://localhost:${kameleoPort}`;

// Initialize the Kameleo client
const client = new KameleoLocalApiClient({
    baseUri: kameleoCliUri,
    noRetryPolicy: true,
});

// Search Chrome Base Profiles
// (Puppeteer won't work with Firefox you can use any Chromium based browser)
const baseProfiles = await client.searchBaseProfiles({
    deviceType: 'desktop',
    browserProduct: 'chrome',
    language: 'en',
});

// Create a new profile with recommended settings
// for browser fingerprint protection
const requestBody = BuilderForCreateProfile
    .forBaseProfile(baseProfiles[0].id)
    .setName('connect with Puppeteer example')
    .setRecommendedDefaults()
    .build();

const profile = await client.createProfile({
    body: requestBody,
});

// Start the Kameleo profile and connect through CDP
const browserWSEndpoint = `ws://localhost:${kameleoPort}/puppeteer/${profile.id}`;
const browser = await puppeteer.connect({
    browserWSEndpoint, defaultViewport: null,
});
const page = await browser.newPage();

// Use any Puppeteer command to drive the browser
// and enjoy full protection from bot detection products
await page.goto('https://wikipedia.org');
await page.click('[name=search]');
await page.keyboard.type('Chameleon');
await page.keyboard.press('Enter');

// Wait for 5 seconds
await setTimeout(5_000);

// Stop the browser by stopping the Kameleo profile
await client.stopProfile(profile.id);

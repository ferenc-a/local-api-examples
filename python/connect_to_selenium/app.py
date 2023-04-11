from kameleo.local_api_client import KameleoLocalApiClient
from kameleo.local_api_client.builder_for_create_profile import BuilderForCreateProfile
from selenium import webdriver
import time


# This is the port Kameleo.CLI is listening on. Default value is 5050, but can be overridden in appsettings.json file
kameleo_port = 5050

client = KameleoLocalApiClient(
    endpoint=f'http://localhost:{kameleo_port}',
    retry_total=0
)

# Search Chrome Base Profiles
base_profiles = client.search_base_profiles(
    device_type='desktop',
    browser_product='chrome'
)

# Create a new profile with recommended settings
# Choose one of the Base Profiles
create_profile_request = BuilderForCreateProfile \
    .for_base_profile(base_profiles[0].id) \
    .set_recommended_defaults() \
    .build()
profile = client.create_profile(body=create_profile_request)

# Start the browser profile
client.start_profile(profile.id)

# Connect to the running browser instance using WebDriver
options = webdriver.ChromeOptions()
options.add_experimental_option("kameleo:profileId", profile.id)
driver = webdriver.Remote(
    command_executor=f'http://localhost:{kameleo_port}/webdriver',
    options=options
)

# Use any WebDriver command to drive the browser
# and enjoy full protection from bot detection products
driver.get('https://google.com')
driver.find_element('css selector', 'div[aria-modal="true"][tabindex="0"] button + button').click()
driver.find_element('name', 'q').send_keys('Kameleo\n')
print(driver.title)

# Wait for 5 seconds
time.sleep(5)

# Stop the browser by stopping the Kameleo profile
client.stop_profile(profile.id)

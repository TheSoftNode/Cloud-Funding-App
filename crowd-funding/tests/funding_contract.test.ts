import { describe, expect, it } from "vitest";
import { Cl, tupleCV } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const wallet = accounts.get("wallet_1")!;
const futureDeadline = simnet.blockHeight + 10; // Set a future deadline for testing

describe("funding_contract contract", () => {
  
  it("creates a campaign successfully", () => {
    const createCampaignCall = simnet.callPublicFn(
      "funding_contract",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii("Test Campaign"),
        Cl.stringAscii("A campaign for testing."),
        Cl.uint(1000), // Valid target
        Cl.uint(futureDeadline), // Valid future deadline
        Cl.stringAscii("https://example.com/image.png"), // Valid image URL
      ],
      wallet
    );
    // Check if the campaign was created successfully and returns the first ID (0)
    expect(createCampaignCall.result).toBeOk(Cl.uint(0));
  });

  it("fails to create a campaign with an invalid title (empty)", () => {
    const createCampaignCall = simnet.callPublicFn(
      "funding_contract",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii(""), // Invalid empty title
        Cl.stringAscii("A campaign for testing."),
        Cl.uint(1000), // Valid target
        Cl.uint(futureDeadline), // Valid future deadline
        Cl.stringAscii("https://example.com/image.png"),
      ],
      wallet
    );
    expect(createCampaignCall.result).toBeErr(Cl.uint(200)); // Expecting err-invalid-title (code 200)
  });

  it("fails to create a campaign with an invalid description (too long)", () => {
    const createCampaignCall = simnet.callPublicFn(
      "funding_contract",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii("Test Campaign"),
        Cl.stringAscii("A".repeat(501)), // Description exceeding 500 characters
        Cl.uint(1000), // Valid target
        Cl.uint(futureDeadline), // Valid future deadline
        Cl.stringAscii("https://example.com/image.png"),
      ],
      wallet
    );
    expect(createCampaignCall.result).toBeErr(Cl.uint(201)); // Expecting err-invalid-description (code 201)
  });

  it("fails to create a campaign with an invalid target (zero)", () => {
    const createCampaignCall = simnet.callPublicFn(
      "funding_contract",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii("Test Campaign"),
        Cl.stringAscii("A campaign for testing."),
        Cl.uint(0), // Invalid target (zero)
        Cl.uint(futureDeadline), // Valid future deadline
        Cl.stringAscii("https://example.com/image.png"),
      ],
      wallet
    );
    expect(createCampaignCall.result).toBeErr(Cl.uint(202)); // Expecting err-invalid-target (code 202)
  });

  it("fails to create a campaign with an invalid deadline (in the past)", () => {
    const createCampaignCall = simnet.callPublicFn(
      "funding_contract",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii("Test Campaign"),
        Cl.stringAscii("A campaign for testing."),
        Cl.uint(1000), // Valid target
        Cl.uint(simnet.blockHeight - 1), // Invalid past deadline
        Cl.stringAscii("https://example.com/image.png"),
      ],
      wallet
    );
    expect(createCampaignCall.result).toBeErr(Cl.uint(203)); // Expecting err-invalid-deadline (code 203)
  });

  it("retrieves a created campaign correctly", async () => {
    // Step 1: Create the campaign first
    const createCampaignCall = simnet.callPublicFn(
      "funding_contract",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii("Test Campaign"),
        Cl.stringAscii("A campaign for testing."),
        Cl.uint(1000),
        Cl.uint(futureDeadline),
        Cl.stringAscii("https://example.com/image.png"),
      ],
      wallet
    );
    expect(createCampaignCall.result).toBeOk(Cl.uint(0)); // Expect campaign ID 0

    // Step 2: Retrieve the campaign
    const getCampaignCall = simnet.callReadOnlyFn(
      "funding_contract",
      "get-campaign",
      [Cl.uint(0)], // Fetch campaign with ID 0
      wallet
    );

    expect(getCampaignCall.result).toBeOk(
      tupleCV({
        owner: Cl.principal(wallet), // Owner
        title: Cl.stringAscii("Test Campaign"), // Title
        description: Cl.stringAscii("A campaign for testing."), // Description
        target: Cl.uint(1000), // Target
        deadline: Cl.uint(futureDeadline), // Deadline
        amount_collected: Cl.uint(0), // Amount collected
        image: Cl.stringAscii("https://example.com/image.png"), // Image
      })
    );
  });

  it("fails to retrieve a non-existent campaign", () => {
    const getCampaignCall = simnet.callReadOnlyFn(
      "funding_contract",
      "get-campaign",
      [Cl.uint(1)], // No campaign exists with ID 1
      wallet
    );
    expect(getCampaignCall.result).toBeErr(Cl.uint(101)); // Expecting campaign not found error (code 101)
  });

  it("creates multiple campaigns and ensures unique IDs", () => {
    // Step 1: Create the first campaign
    const createCampaign1 = simnet.callPublicFn(
      "funding_contract",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii("Campaign 1"),
        Cl.stringAscii("First campaign."),
        Cl.uint(500),
        Cl.uint(futureDeadline),
        Cl.stringAscii("https://example.com/image1.png"),
      ],
      wallet
    );
    expect(createCampaign1.result).toBeOk(Cl.uint(0)); // First campaign ID is 0

    // Step 2: Create the second campaign
    const createCampaign2 = simnet.callPublicFn(
      "funding_contract",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii("Campaign 2"),
        Cl.stringAscii("Second campaign."),
        Cl.uint(2000),
        Cl.uint(futureDeadline + 5), // Slightly later deadline
        Cl.stringAscii("https://example.com/image2.png"),
      ],
      wallet
    );
    expect(createCampaign2.result).toBeOk(Cl.uint(1)); // Second campaign ID should be 1
  });
});




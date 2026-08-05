from AI_Module.AIML.dataset_generator.physiology import Driver

driver = Driver()

print("=" * 50)
print("SIMULATOR TEST")
print("=" * 50)

states = [
    "NORMAL",
    "WARNING",
    "CARDIAC_EVENT"
]

for state in states:

    print(f"\nTesting {state}")

    sample = driver.update(state)

    for key, value in sample.items():
        print(f"{key:25}: {value}")

print("\nSimulator Test Passed")
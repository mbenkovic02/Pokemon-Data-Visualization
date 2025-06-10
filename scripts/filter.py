import pandas as pd

# Učitaj originalni CSV
input_path = "Pokemon Database.csv"
df = pd.read_csv(input_path)

# Popis stupaca koje treba izbaciti
columns_to_drop = [
    "Pokemon Id",
    "Original Pokemon ID",
    "Special Event Ability",
    "Special Event Ability Description",
    "Male Ratio",
    "Female Ratio",
    "Base Happiness",
    "Catch Rate",
    "Experience Growth",
    "Primary Egg Group",
    "Secondary Egg Group",
    "Egg Cycle Count"
    "Evolution Details"
]

# Ukloni stupce koji postoje u DataFrameu
filtered_df = df.drop(columns=[col for col in columns_to_drop if col in df.columns])

# Spremi filtrirani CSV
output_path = "Pokemon_Database_Filtered.csv"
filtered_df.to_csv(output_path, index=False)

print("Filtrirani CSV spremljen kao:", output_path)
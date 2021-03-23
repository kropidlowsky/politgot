import json


def read_json(file: str):
    """:returns json file as dictionary"""
    with open(file) as f:
        return json.load(f)


if __name__ == "__main__":
    print(read_json('data_collectors/goverment/representative_profiles/representatives.json'))

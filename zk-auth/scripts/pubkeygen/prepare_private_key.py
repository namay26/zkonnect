import json

def prepare_private_key_hex(private_key_hex, n, k):
    """
    Prepare a hex string of a private key ready for input.json in ECDSAPrivToPub(n, k).
    
    Args:
        private_key_hex (str): The private key as a hex string.
        n (int): The number of bits in each register.
        k (int): The number of registers.
        
    Returns:
        str: JSON formatted string ready for input.json.
    """
    # Convert hex string to an integer
    private_key_int = int(private_key_hex, 16)
    
    # Calculate the mask to extract n-bit chunks
    mask = (1 << n) - 1
    
    # Extract k chunks of n bits
    privkey_chunks = [(private_key_int >> (i * n)) & mask for i in range(k)]
    
    # Prepare the JSON input
    input_data = {
        "privkey": privkey_chunks
    }
    
    return json.dumps(input_data, indent=4)

# Example usage
private_key_hex = "96420fa661d56fd8818c7a54b1c0df81766ddab9cf31de8a77b72bcca1f3a30f"
n = 64
k = 4
input_json = prepare_private_key_hex(private_key_hex, n, k)
print(input_json)


import json

def privkey_chunks_to_hex(privkey_chunks, n):
    """
    Convert private key chunks back to a hex string.
    
    Args:
        privkey_chunks (list): The list of chunks representing the private key.
        n (int): The number of bits in each chunk.
        
    Returns:
        str: The private key as a hex string.
    """
    private_key_int = 0
    for i, chunk in enumerate(privkey_chunks):
        private_key_int |= chunk << (i * n)
    
    # Convert the integer back to a hex string
    private_key_hex = hex(private_key_int)[2:].rstrip("L")
    
    return private_key_hex

# Example usage
privkey_json = '''
{
    "privkey": [
        9020461822957481853,
        2034882110541229066,
        0,
        0
    ]
}
'''

# Load the JSON
privkey_data = json.loads(privkey_json)

# Convert back to hex string
n = 64  # Assuming each chunk is 64 bits
private_key_hex = privkey_chunks_to_hex(privkey_data['privkey'], n)
print(private_key_hex)

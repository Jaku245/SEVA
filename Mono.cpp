#include <bits/stdc++.h>
using namespace std;

string encoder(string key)
{
    string encoded = "";
    bool arr[26] = {0};

    for (int i = 0; i < key.size(); i++)
    {
        if (key[i] >= 'A' && key[i] <= 'Z')
        {
            if (arr[key[i] - 65] == 0)
            {
                encoded += key[i];
                arr[key[i] - 65] = 1;
            }
        }
        else if (key[i] >= 'a' && key[i] <= 'z')
        {
            if (arr[key[i] - 97] == 0)
            {
                encoded += key[i] - 32;
                arr[key[i] - 97] = 1;
            }
        }
    }

    for (int i = 0; i < 26; i++)
    {
        if (arr[i] == 0)
        {
            arr[i] = 1;
            encoded += char(i + 65);
        }
    }
    return encoded;
}

string cipheredIt(string msg, string encoded)
{
    string cipher = "";
    for (int i = 0; i < msg.size(); i++)
    {
        if (msg[i] >= 'a' && msg[i] <= 'z')
        {
            int pos = msg[i] - 97;
            cipher += encoded[pos] + 32;
        }
        else if (msg[i] >= 'A' && msg[i] <= 'Z')
        {
            int pos = msg[i] - 65;
            cipher += encoded[pos];
        }
        else
        {
            cipher += msg[i];
        }
    }
    return cipher;
}

string decipheredIt(string msg, string encoded)
{
    string cipher = "";
    for (int i = 0; i < msg.size(); i++)
    {
        if (msg[i] >= 'a' && msg[i] <= 'z')
        {
            char temp = msg[i] - 32;
            for (int j = 0; j < encoded.size(); j++)
            {
                if (temp == encoded[j])
                {
                    cipher += char(j + 97);
                }
            }
        }
        else if (msg[i] >= 'A' && msg[i] <= 'Z')
        {
            for (int j = 0; j < encoded.size(); j++)
            {

                if (msg[i] == encoded[j])
                {
                    cipher += char(j + 65);
                }
            }
        }
        else
        {
            cipher += msg[i];
        }
    }
    return cipher;
}

int main()
{
    cout << "Keyword : ";
    string key;
    getline(cin,key);

    string encoded = encoder(key);
    
    string message;
    cout << "Message for Ciphering : ";
    getline(cin,message);
    
    string cipher = cipheredIt(message, encoded);
    
    cout << "Ciphered Text : " << cipher << endl;
    cout << "Deciphered Text : " << decipheredIt(cipher, encoded) << endl;

    return 0;
}
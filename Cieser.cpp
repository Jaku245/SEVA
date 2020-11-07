#include <iostream>
#include <string.h>
using namespace std;

string ciphered(int key, string msg)
{
	char ch;
	for (int i = 0; msg[i] != '\0'; ++i)
	{
		ch = msg[i];

		//encrypt for lowercase letter
		if (ch >= 'a' && ch <= 'z')
		{
			ch = ch + key;
			if (ch > 'z')
			{
				ch = ch - 'z' + 'a' - 1;
			}
			msg[i] = ch;
		}
		//encrypt for uppercase letter
		else if (ch >= 'A' && ch <= 'Z')
		{
			ch = ch + key;
			if (ch > 'Z')
			{
				ch = ch - 'Z' + 'A' - 1;
			}
			msg[i] = ch;
		}
	}
	return msg;
}

string deciphered(int key, string msg)
{
	char ch;
	for (int i = 0; msg[i] != '\0'; ++i)
	{
		ch = msg[i];

		//decrypt for lowercase letter
		if (ch >= 'a' && ch <= 'z')
		{
			ch = ch - key;
			if (ch < 'a')
			{
				ch = ch + 'z' - 'a' + 1;
			}
			msg[i] = ch;
		}

		//decrypt for uppercase letter
		else if (ch >= 'A' && ch <= 'Z')
		{
			ch = ch - key;
			if (ch < 'A')
			{
				ch = ch + 'Z' - 'A' + 1;
			}
			msg[i] = ch;
		}
	}

	return msg;
}

int main()
{
	cout << "Enter the message:\n";
	string msg;

	//take the message as input
	getline(cin,msg);

	int i, j, length, key, choice;
	cout << "Enter key: ";

	//take the key as input
	cin >> key;

	//Encryption
	string cipheredMsg = ciphered(key, msg);
	cout << "Ciphered message: " << cipheredMsg << endl;

	//Decryption
	cout << "Deciphered message: " << deciphered(key,cipheredMsg);
}

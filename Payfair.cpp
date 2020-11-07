#include <bits/stdc++.h>
using namespace std;

string cipheredIt(string msg, char encoded[5][5])
{
    string cipher = "";
    for (int i = 0; i < msg.size(); i += 2)
    {
        char fl = msg[i];
        char sl = msg[i + 1];
        int flRow, flCol, slRow, slCol;

        for (int j = 0; j < 5; j++)
        {
            for (int k = 0; k < 5; k++)
            {
                if (fl == encoded[j][k])
                {
                    flRow = j;
                    flCol = k;
                }
                if (sl == encoded[j][k])
                {
                    slRow = j;
                    slCol = k;
                }
            }
        }

        if (flRow == slRow)
        {
            cipher += flCol == 4 ? encoded[flRow][0] : encoded[flRow][flCol+1] ;
            cipher += slCol == 4 ? encoded[slRow][0] : encoded[slRow][slCol+1] ;
        }
        else if (flCol == slCol)
        {
            cipher += flRow == 4 ? encoded[0][flCol] : encoded[flRow+1][flCol] ;
            cipher += slRow == 4 ? encoded[0][slCol] : encoded[slRow+1][slCol] ;
        }
        else
        {
            cipher += encoded[flRow][slCol];
            cipher += encoded[slRow][flCol];
        }
    }
    return cipher;
}

string decipheredIt(string msg, char encoded[5][5])
{
    string deCipher = "";
    for (int i = 0; i < msg.size(); i += 2)
    {
        char fl = msg[i];
        char sl = msg[i + 1];
        int flRow, flCol, slRow, slCol;

        for (int j = 0; j < 5; j++)
        {
            for (int k = 0; k < 5; k++)
            {
                if (fl == encoded[j][k])
                {
                    flRow = j;
                    flCol = k;
                }
                if (sl == encoded[j][k])
                {
                    slRow = j;
                    slCol = k;
                }
            }
        }

        if (flRow == slRow)
        {
            deCipher += flCol == 0 ? encoded[flRow][4] : encoded[flRow][flCol-1] ;
            deCipher += slCol == 0 ? encoded[slRow][4] : encoded[slRow][slCol-1] ;
        }
        else if (flCol == slCol)
        {
            deCipher += flRow == 0 ? encoded[4][flCol] : encoded[flRow-1][flCol] ;
            deCipher += slRow == 0 ? encoded[4][slCol] : encoded[slRow-1][slCol] ;
        }
        else
        {
            deCipher += encoded[flRow][slCol];
            deCipher += encoded[slRow][flCol];
        }
    }
    return deCipher;
}

string modify(string str)
{
    int count = 0;
    string modified = "";
    modified += str[0];
    count++;
    for (int i = 1; i < str.size(); i++)
    {
        if (count % 2 == 0)
        {
            modified += str[i];
            count++;
        }
        else
        {
            if (modified[count - 1] != str[i])
            {
                modified += str[i];
                count++;
            }
            else
            {
                modified += 'x';
                count++;
                modified += str[i];
                count++;
            }
        }
    }
    if (count % 2 != 0)
    {
        modified += 'x';
    }
    return modified;
}

string original(string msg)
{
    string str = "";
    for(int i=0;i<msg.size();i++){
        if(msg[i]!='x')
        {
            str += msg[i];
        }
    }
    return str;
}

int main()
{
    string key;
    cout << "Keyword : ";
    getline(cin, key);
    char pfMatrix[5][5];

    string encoded = "";
    bool arr[26] = {0};

    for (int i = 0; i < key.size(); i++)
    {
        if (key[i] >= 'A' && key[i] <= 'Z')
        {
            if (key[i] == 'J')
            {
                arr[key[i] - 65] = 1;
                key[i] = 'I';
            }
            if (arr[key[i] - 65] == 0)
            {
                encoded += key[i];
                arr[key[i] - 65] = 1;
            }
        }
        else if (key[i] >= 'a' && key[i] <= 'z')
        {
            if (key[i] == 'j')
            {
                arr[key[i] - 97] = 1;
                key[i] = 'i';
            }
            if (arr[key[i] - 97] == 0)
            {
                encoded += key[i] - 32;
                arr[key[i] - 97] = 1;
            }
        }
    }

    for (int i = 0; i < 26; i++)
    {
        if (arr[i] == 0 && i != 9)
        {
            arr[i] = 1;
            encoded += char(i + 65);
        }
    }
    int rowColSum = 0;

    for (int i = 0; i < 5; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            pfMatrix[i][j] = encoded[rowColSum] + 32;
            rowColSum++;
        }
    }

    for (int i = 0; i < 5; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            cout << pfMatrix[i][j] << " ";
        }
        cout << endl;
    }

    string message;
    cout << "Message for Ciphering : ";
    getline(cin, message);
    string modifiedStr = modify(message);
    string cipher = cipheredIt(modifiedStr, pfMatrix);
    cout << "Ciphered Text : " << cipher << endl;
    string deCipher = decipheredIt(cipher, pfMatrix);
    cout << "Deciphered Text : " << original(deCipher) << endl;

    return 0;
}
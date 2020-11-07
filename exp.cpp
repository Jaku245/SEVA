#include <iostream>
using namespace std;
int main()
{
    int scores[] = { 1, 2, 4, 1, 3, 1, 1, 4, 6, 0, 0, 1, 1, 1, 2, 1, 0, 6, 0, 0, 1, 2, 1, 0, 0, 4, 0, 1, 0 };
    bool dravid = true;
    int dravidScore = 0;
    int sachinScore = 0;
    for (int i = 0; i < sizeof(scores)/sizeof(scores[0]); i++)
    {
        if (dravid)
        {
            dravidScore += scores[i];
            if (scores[i] % 2 != 0)
            {
                dravid = false;
            }
            if ((i + 1) % 6 == 0)
            {
                if (scores[i] % 2 == 0)
                {
                    dravid = false;
                }else
                {
                    dravid = true;
                }
                
            }
        }
        else
        {
            sachinScore += scores[i];
            if (scores[i] % 2 != 0)
            {
                dravid = true;
            }
            if ((i + 1) % 6 == 0)
            {
                if (scores[i] % 2 == 0)
                {
                    dravid = true;
                }else
                {
                    dravid = false;
                }
                
            }
        }
    }
    cout<<"Dravid : "<<dravidScore<<endl;
    cout<<"Sachin : "<<sachinScore<<endl;
    return 0;
}
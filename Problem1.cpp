#include<iostream>
using namespace std;
int main(){
    int count,nors1,nors2;
    nors1=nors2=0;
    string s1;
    string s2;
    cin>>count;
    cin>>s1;
    cin>>s2;
    for(int i=0;i<count;i++){
        if(s1[i]=='r'){
            nors1++;
        }
        if(s2[i]=='r'){
            nors2++;
        }
    }
    int ans = nors1 - nors2;
    if(ans==0){
        cout<<ans;
    }else if(ans<0){
        ans*=-1;
        cout<<++ans;
    }else if(ans>0){
        ans++;
        cout<<ans;
    }
    return 0;
}
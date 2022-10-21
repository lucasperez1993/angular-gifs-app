import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey: string = 'nwoKImuN99Q9wcdHmRbIUfwATQDpI8Xm';
  private url: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('ultimaBusqueda')!) || [];
  }

  buscarGifs(query: string){

    query = query.trim().toLowerCase()

    if(!this._historial.includes( query )){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10)

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
          .set('apiKey', this.apiKey)
          .set('q', query)
          .set('limit', 10);

    this.http.get<SearchGifsResponse>(`${this.url}/search`, {params})
        .subscribe((resp) => {
          this.resultados = resp.data;
        localStorage.setItem('ultimaBusqueda', JSON.stringify(this.resultados));
        })
  }

}

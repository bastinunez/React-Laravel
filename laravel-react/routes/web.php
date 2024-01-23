<?php

use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\HistorialAccionFormularioController;
use App\Http\Controllers\HistorialAccionUsuarioController;
use App\Http\Controllers\HistorialDocumentosAnexosController;
use App\Http\Controllers\HistorialDocumentosController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest');

Route::get('/registro', function () {
    return Inertia::render('Auth/Register');
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');


    //DOCUMENTOS
    Route::resource('documento', DocumentoController::class)->names('documento');
    Route::post('documento-anexo', [DocumentoController::class, 'store_anexo'])->name('documento.store_anexo');
    Route::get('/api/documentos-anexos/{id}', [DocumentoController::class, 'get_doc_anexos']);
    Route::get('/documento/visualizar/{mensaje}', [DocumentoController::class, 'visualizar'])->name('documento.visualizar');
    Route::post('/documento/gestion', [DocumentoController::class, 'gestion_index'])->name('documento.gestion_index');
    Route::post('documento-anular', [DocumentoController::class, 'anular'])->name('documento.anular');
    Route::post('documento-habilitar', [DocumentoController::class, 'habilitar'])->name('documento.habilitar');
    Route::post('documento-descargar', [DocumentoController::class, 'descargar'])->name('documento.descargar');
    

    //USUARIOS
    Route::get('/usuarios/gestion', [UsuarioController::class, 'gestion_index'])->name('usuario.gestion.index');
    Route::post('/usuarios/editar-datos', [UsuarioController::class, 'edit_data'])->name('usuario.edit_data');
    Route::post('/usuarios/editar', [UsuarioController::class, 'update_pwd'])->name('usuario.update_pwd');
 
    Route::resource('historial-documentos', HistorialDocumentosController::class)->names('historialdocumentos');
    Route::resource('historial-documentos-anexos', HistorialDocumentosAnexosController::class)->names('historialdocumentosanexos');
    Route::resource('historial-accion-usuario', HistorialAccionUsuarioController::class)->names('historialaccionusuario');
    Route::resource('historial-accion-formulario', HistorialAccionFormularioController::class)->names('historialaccionformulario');
    Route::resource('usuario', UsuarioController::class);
  


});

//require __DIR__.'/auth.php';
